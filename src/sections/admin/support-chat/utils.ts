import dayjs from 'dayjs';
import { useEffect, useRef } from 'react';

import type { Conversation, Message } from 'src/api/admin-types';

export const MAX_MESSAGE_LENGTH = 4000;
export const MAX_FILE_SIZE = 10 * 1024 * 1024;
export const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
export const FILE_ACCEPT = '.jpg,.jpeg,.png,.webp,.pdf,image/jpeg,image/png,image/webp,application/pdf';

export const INBOX_PAGE_SIZE = 20;
export const MESSAGES_PAGE_SIZE = 30;

export const UNREAD_SUMMARY_POLL_MS = 30_000;
export const INBOX_POLL_MS = 15_000;
export const THREAD_POLL_MS = 7_000;

export const UNREAD_SUMMARY_QUERY_KEY = ['admin-conversations-unread-summary'];

export type ChatMessage = Message & {
  local_status?: 'sending' | 'failed';
  upload_progress?: number;
  local_file?: File;
};

export function createClientMessageId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
}

export function validateAttachment(file: File): string | null {
  if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    return 'Only JPG, PNG, WEBP images or PDF files are allowed.';
  }
  if (file.size > MAX_FILE_SIZE) {
    return 'File is too large. Maximum size is 10MB.';
  }
  return null;
}

export function formatFileSize(bytes?: number | null) {
  if (!bytes || bytes <= 0) return '';
  const units = ['B', 'KB', 'MB', 'GB'];
  let value = bytes;
  let unit = 0;
  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024;
    unit += 1;
  }
  return `${value.toFixed(value < 10 && unit > 0 ? 1 : 0)} ${units[unit]}`;
}

export function formatInboxTime(date?: string | null) {
  if (!date) return '';
  const d = dayjs(date);
  if (!d.isValid()) return '';
  const diffMinutes = dayjs().diff(d, 'minute');
  if (diffMinutes < 1) return 'now';
  if (diffMinutes < 60) return `${diffMinutes}m`;
  if (d.isSame(dayjs(), 'day')) return d.format('h:mm a');
  if (d.isSame(dayjs().subtract(1, 'day'), 'day')) return 'Yesterday';
  if (dayjs().diff(d, 'day') < 7) return d.format('ddd');
  return d.format('DD MMM YY');
}

export function formatDateSeparator(date: string) {
  const d = dayjs(date);
  if (d.isSame(dayjs(), 'day')) return 'Today';
  if (d.isSame(dayjs().subtract(1, 'day'), 'day')) return 'Yesterday';
  return d.format('DD MMM YYYY');
}

export function formatMessageTime(date: string) {
  return dayjs(date).format('h:mm a');
}

export function isSameDay(a: string, b: string) {
  return dayjs(a).isSame(dayjs(b), 'day');
}

export function displayName(conversation?: Pick<Conversation, 'user_name' | 'user_phone'> | null) {
  return conversation?.user_name || conversation?.user_phone || 'Unknown user';
}

export function sortConversations(list: Conversation[]) {
  return [...list].sort((a, b) => {
    const at = a.last_message_at ? new Date(a.last_message_at).getTime() : 0;
    const bt = b.last_message_at ? new Date(b.last_message_at).getTime() : 0;
    return bt - at;
  });
}

/**
 * Merges incoming messages into the current list, deduping by `id` and by
 * `client_message_id` (so optimistic bubbles are replaced by the server copy),
 * and keeps the result ordered oldest -> newest.
 */
export function mergeMessages(current: ChatMessage[], incoming: Message[]): ChatMessage[] {
  if (!incoming.length) return current;
  const next = [...current];
  for (const msg of incoming) {
    const index = next.findIndex(
      (m) => m.id === msg.id || (!!msg.client_message_id && m.client_message_id === msg.client_message_id)
    );
    if (index >= 0) {
      next[index] = msg;
    } else {
      next.push(msg);
    }
  }
  return next.sort((a, b) => {
    if (a.local_status && !b.local_status) return 1;
    if (!a.local_status && b.local_status) return -1;
    return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
  });
}

/**
 * Runs `callback` every `intervalMs` while the tab is visible, and immediately
 * when the tab becomes visible again or the window regains focus.
 */
export function useVisiblePolling(callback: () => void, intervalMs: number, enabled = true) {
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (!enabled) return undefined;

    const tick = () => {
      if (document.visibilityState === 'visible') savedCallback.current();
    };

    const timer = window.setInterval(tick, intervalMs);
    const onVisibility = () => {
      if (document.visibilityState === 'visible') savedCallback.current();
    };
    const onFocus = () => savedCallback.current();

    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('focus', onFocus);

    return () => {
      window.clearInterval(timer);
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('focus', onFocus);
    };
  }, [intervalMs, enabled]);
}

let audioContext: AudioContext | null = null;

export function playNotificationSound() {
  try {
    const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctx) return;
    audioContext = audioContext || new Ctx();
    const ctx = audioContext;
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(880, ctx.currentTime);
    oscillator.frequency.setValueAtTime(1320, ctx.currentTime + 0.09);
    gain.gain.setValueAtTime(0.0001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.15, ctx.currentTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.25);
    oscillator.connect(gain);
    gain.connect(ctx.destination);
    oscillator.start();
    oscillator.stop(ctx.currentTime + 0.26);
  } catch {
    // Browsers may block audio until the user interacts with the page.
  }
}
