import { Fragment, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import { ArrowLeft, FileText, Paperclip, Send, UserRound, X } from 'lucide-react';

import { RouterLink } from 'src/routes/components';

import { useSnackbar } from 'src/components/snackbar';
import { getErrorMessage } from 'src/lib/utils';
import { adminConversationsService } from 'src/api/admin-services';

import type { Conversation, ConversationStatus, Message } from 'src/api/admin-types';

import { MessageBubble } from './message-bubble';
import {
  FILE_ACCEPT,
  MAX_MESSAGE_LENGTH,
  MESSAGES_PAGE_SIZE,
  THREAD_POLL_MS,
  createClientMessageId,
  displayName,
  formatDateSeparator,
  formatFileSize,
  isSameDay,
  mergeMessages,
  playNotificationSound,
  useVisiblePolling,
  validateAttachment,
  type ChatMessage,
} from './utils';

// Every Nth poll re-fetches the latest page instead of `after`, so ✓✓ read
// receipts on already-loaded admin messages stay up to date.
const FULL_REFRESH_EVERY = 4;

type Props = {
  conversationId: string;
  initialConversation?: Conversation;
  onConversationChange: (conversation: Conversation) => void;
  onMarkedRead: (conversationId: string) => void;
  onBack?: () => void;
};

export function ChatThread({ conversationId, initialConversation, onConversationChange, onMarkedRead, onBack }: Props) {
  const { showSnackbar } = useSnackbar();

  const [conversation, setConversation] = useState<Conversation | null>(initialConversation ?? null);
  const [headerError, setHeaderError] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [hasMore, setHasMore] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [loadingOlder, setLoadingOlder] = useState(false);
  const [text, setText] = useState('');
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);

  const activeIdRef = useRef(conversationId);
  const messagesRef = useRef<ChatMessage[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const stickToBottomRef = useRef(true);
  const prependAnchorRef = useRef<{ height: number; top: number } | null>(null);
  const pollCountRef = useRef(0);
  const pollingRef = useRef(false);

  messagesRef.current = messages;
  activeIdRef.current = conversationId;

  const onConversationChangeRef = useRef(onConversationChange);
  const onMarkedReadRef = useRef(onMarkedRead);
  onConversationChangeRef.current = onConversationChange;
  onMarkedReadRef.current = onMarkedRead;

  const applyConversation = useCallback((next: Conversation | null | undefined) => {
    if (!next || next.id !== activeIdRef.current) return;
    setConversation(next);
    onConversationChangeRef.current(next);
  }, []);

  const fetchHeader = useCallback(async () => {
    const id = activeIdRef.current;
    try {
      const data = await adminConversationsService.getConversation(id);
      if (id !== activeIdRef.current) return;
      setHeaderError(null);
      applyConversation(data);
    } catch (error) {
      if (id !== activeIdRef.current) return;
      setHeaderError(getErrorMessage(error, 'Conversation not found.'));
    }
  }, [applyConversation]);

  const loadLatest = useCallback(async (isInitial: boolean) => {
    const id = activeIdRef.current;
    try {
      const res = await adminConversationsService.getMessages(id, { limit: MESSAGES_PAGE_SIZE });
      if (id !== activeIdRef.current) return;
      setLoadError(null);
      if (isInitial) {
        stickToBottomRef.current = true;
        setHasMore(res.has_more);
        setMessages(res.data);
      } else {
        const known = new Set(messagesRef.current.map((m) => m.id));
        const hasNewUserMessages = res.data.some((m) => m.sender_role === 'user' && !known.has(m.id));
        setMessages((prev) => mergeMessages(prev, res.data));
        if (hasNewUserMessages) playNotificationSound();
      }
      onMarkedReadRef.current(id);
    } catch (error) {
      if (id !== activeIdRef.current) return;
      if (isInitial) setLoadError(getErrorMessage(error, 'Failed to load messages.'));
    } finally {
      if (isInitial && id === activeIdRef.current) setInitialLoading(false);
    }
  }, []);

  useEffect(() => {
    setConversation(initialConversation ?? null);
    setHeaderError(null);
    setMessages([]);
    setHasMore(false);
    setInitialLoading(true);
    setLoadError(null);
    setText('');
    setPendingFile(null);
    pollCountRef.current = 0;
    stickToBottomRef.current = true;
    fetchHeader();
    loadLatest(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversationId]);

  const pollNew = useCallback(async () => {
    if (pollingRef.current) return;
    const id = activeIdRef.current;
    const newest = [...messagesRef.current].reverse().find((m) => !m.local_status);

    pollCountRef.current += 1;
    if (!newest || pollCountRef.current % FULL_REFRESH_EVERY === 0) {
      pollingRef.current = true;
      try {
        await loadLatest(false);
      } finally {
        pollingRef.current = false;
      }
      return;
    }

    pollingRef.current = true;
    try {
      const res = await adminConversationsService.getMessages(id, { after: newest.id });
      if (id !== activeIdRef.current || !res.data.length) return;
      const known = new Set(messagesRef.current.map((m) => m.id));
      const fresh = res.data.filter((m) => !known.has(m.id));
      setMessages((prev) => mergeMessages(prev, res.data));
      if (fresh.some((m) => m.sender_role === 'user')) {
        playNotificationSound();
        onMarkedReadRef.current(id);
        fetchHeader();
      }
    } catch {
      // Polling failures are silent; the next tick retries.
    } finally {
      pollingRef.current = false;
    }
  }, [fetchHeader, loadLatest]);

  useVisiblePolling(pollNew, THREAD_POLL_MS, !initialLoading && !loadError);

  const loadOlder = useCallback(async () => {
    if (loadingOlder || !hasMore) return;
    const oldest = messagesRef.current.find((m) => !m.local_status);
    if (!oldest) return;
    const id = activeIdRef.current;
    setLoadingOlder(true);
    try {
      const res = await adminConversationsService.getMessages(id, { before: oldest.id, limit: MESSAGES_PAGE_SIZE });
      if (id !== activeIdRef.current) return;
      const el = scrollRef.current;
      if (el) prependAnchorRef.current = { height: el.scrollHeight, top: el.scrollTop };
      setHasMore(res.has_more);
      setMessages((prev) => mergeMessages(prev, res.data));
    } catch (error) {
      showSnackbar(getErrorMessage(error, 'Failed to load older messages.'), 'error');
    } finally {
      setLoadingOlder(false);
    }
  }, [hasMore, loadingOlder, showSnackbar]);

  useLayoutEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    if (prependAnchorRef.current) {
      const { height, top } = prependAnchorRef.current;
      el.scrollTop = el.scrollHeight - height + top;
      prependAnchorRef.current = null;
      return;
    }
    if (stickToBottomRef.current) {
      el.scrollTop = el.scrollHeight;
    }
  }, [messages]);

  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    stickToBottomRef.current = el.scrollHeight - el.scrollTop - el.clientHeight < 80;
    if (el.scrollTop < 80) loadOlder();
  }, [loadOlder]);

  const updateLocalMessage = useCallback((clientId: string, patch: Partial<ChatMessage>) => {
    setMessages((prev) => prev.map((m) => (m.client_message_id === clientId && m.local_status ? { ...m, ...patch } : m)));
  }, []);

  const performSend = useCallback(
    async (local: ChatMessage) => {
      const id = local.conversation_id;
      const clientId = local.client_message_id as string;
      try {
        const res = await adminConversationsService.sendMessage(
          id,
          { message: local.message || undefined, file: local.local_file, client_message_id: clientId },
          local.local_file ? (percent) => updateLocalMessage(clientId, { upload_progress: percent }) : undefined
        );
        if (id !== activeIdRef.current) return;
        setMessages((prev) => mergeMessages(prev, [res.message as Message]));
        if (res.conversation) {
          applyConversation(res.conversation);
        } else {
          fetchHeader();
        }
      } catch (error) {
        if (id !== activeIdRef.current) return;
        updateLocalMessage(clientId, { local_status: 'failed', upload_progress: undefined });
        showSnackbar(getErrorMessage(error, 'Failed to send message.'), 'error');
      }
    },
    [applyConversation, fetchHeader, showSnackbar, updateLocalMessage]
  );

  const handleSend = useCallback(() => {
    const body = text.trim();
    if (!body && !pendingFile) return;
    if (body.length > MAX_MESSAGE_LENGTH) {
      showSnackbar(`Message cannot exceed ${MAX_MESSAGE_LENGTH} characters.`, 'error');
      return;
    }

    const clientId = createClientMessageId();
    const local: ChatMessage = {
      id: `local-${clientId}`,
      conversation_id: conversationId,
      sender_id: '',
      sender_role: 'admin',
      sender_name: null,
      sender_photo: null,
      message_type: pendingFile ? (pendingFile.type.startsWith('image/') ? 'image' : 'document') : 'text',
      message: body || null,
      attachment_url: null,
      attachment_name: pendingFile?.name ?? null,
      attachment_mime: pendingFile?.type ?? null,
      attachment_size: pendingFile?.size ?? null,
      client_message_id: clientId,
      is_read: false,
      read_at: null,
      created_at: new Date().toISOString(),
      local_status: 'sending',
      local_file: pendingFile ?? undefined,
    };

    stickToBottomRef.current = true;
    setMessages((prev) => [...prev, local]);
    setText('');
    setPendingFile(null);
    performSend(local);
  }, [conversationId, pendingFile, performSend, showSnackbar, text]);

  const handleRetry = useCallback(
    (message: ChatMessage) => {
      if (!message.client_message_id) return;
      updateLocalMessage(message.client_message_id, { local_status: 'sending', upload_progress: undefined });
      performSend({ ...message, local_status: 'sending' });
    },
    [performSend, updateLocalMessage]
  );

  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      event.target.value = '';
      if (!file) return;
      const error = validateAttachment(file);
      if (error) {
        showSnackbar(error, 'error');
        return;
      }
      setPendingFile(file);
    },
    [showSnackbar]
  );

  const handleStatusChange = useCallback(
    async (status: ConversationStatus) => {
      setStatusUpdating(true);
      try {
        const updated = await adminConversationsService.updateStatus(conversationId, { status });
        applyConversation(updated);
        showSnackbar('Status updated', 'success');
      } catch (error) {
        showSnackbar(getErrorMessage(error, 'Failed to update status.'), 'error');
      } finally {
        setStatusUpdating(false);
      }
    },
    [applyConversation, conversationId, showSnackbar]
  );

  if (headerError && !conversation) {
    return (
      <Box sx={{ height: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
        <Typography color="text.secondary">{headerError}</Typography>
        {onBack && <Button onClick={onBack}>Back to inbox</Button>}
      </Box>
    );
  }

  const name = displayName(conversation);
  const canOpenProfile = !!conversation?.user_id && (!conversation.user_role || conversation.user_role === 'USER');

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: 1, minHeight: 0 }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          px: 2,
          py: 1.25,
          borderBottom: 1,
          borderColor: 'divider',
          bgcolor: 'background.paper',
        }}
      >
        {onBack && (
          <IconButton onClick={onBack} sx={{ display: { md: 'none' } }} aria-label="Back to inbox">
            <ArrowLeft size={20} />
          </IconButton>
        )}
        <Avatar src={conversation?.user_photo || undefined} alt={name} sx={{ width: 42, height: 42 }}>
          {name.charAt(0).toUpperCase()}
        </Avatar>
        <Box sx={{ flex: '1 1 auto', minWidth: 0 }}>
          <Typography variant="subtitle1" noWrap>
            {conversation ? name : 'Loading…'}
          </Typography>
          <Typography variant="caption" color="text.secondary" noWrap component="div">
            {[conversation?.user_phone, conversation?.user_email].filter(Boolean).join(' · ')}
          </Typography>
        </Box>
        {canOpenProfile && (
          <Tooltip title="View user profile">
            <IconButton component={RouterLink} href={`/users/${conversation?.user_id}`}>
              <UserRound size={20} />
            </IconButton>
          </Tooltip>
        )}
        {conversation && (
          <TextField
            select
            size="small"
            value={conversation.status}
            disabled={statusUpdating}
            onChange={(e) => handleStatusChange(e.target.value as ConversationStatus)}
            sx={{ minWidth: 120 }}
          >
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="closed">Closed</MenuItem>
            <MenuItem value="archived">Archived</MenuItem>
          </TextField>
        )}
      </Box>

      <Box
        ref={scrollRef}
        onScroll={handleScroll}
        sx={(theme) => ({
          flex: '1 1 auto',
          minHeight: 0,
          overflowY: 'auto',
          px: { xs: 1.5, md: 3 },
          py: 2,
          bgcolor: theme.vars.palette.background.neutral,
        })}
      >
        {initialLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
            <CircularProgress size={28} />
          </Box>
        ) : loadError ? (
          <Box sx={{ textAlign: 'center', py: 6 }}>
            <Typography variant="body2" color="error.main" sx={{ mb: 1 }}>
              {loadError}
            </Typography>
            <Button
              size="small"
              onClick={() => {
                setInitialLoading(true);
                loadLatest(true);
              }}
            >
              Retry
            </Button>
          </Box>
        ) : !messages.length ? (
          <Box sx={{ textAlign: 'center', py: 6, color: 'text.secondary' }}>
            <Typography variant="body2">No messages yet. Send the first message to {name}.</Typography>
          </Box>
        ) : (
          <>
            {hasMore && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1.5 }}>
                {loadingOlder ? (
                  <CircularProgress size={20} />
                ) : (
                  <Button size="small" onClick={loadOlder}>
                    Load older messages
                  </Button>
                )}
              </Box>
            )}
            {messages.map((message, index) => {
              const prev = messages[index - 1];
              const showSeparator = !prev || !isSameDay(prev.created_at, message.created_at);
              return (
                <Fragment key={message.client_message_id || message.id}>
                  {showSeparator && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', my: 1.5 }}>
                      <Chip
                        size="small"
                        label={formatDateSeparator(message.created_at)}
                        sx={{ bgcolor: 'background.paper', boxShadow: '0 1px 1px rgba(0,0,0,0.08)' }}
                      />
                    </Box>
                  )}
                  <MessageBubble message={message} onImageClick={setLightboxUrl} onRetry={handleRetry} />
                </Fragment>
              );
            })}
          </>
        )}
      </Box>

      <Box sx={{ px: 2, py: 1.25, borderTop: 1, borderColor: 'divider', bgcolor: 'background.paper' }}>
        {pendingFile && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              mb: 1,
              p: 1,
              borderRadius: 1,
              bgcolor: 'background.neutral',
            }}
          >
            <FileText size={18} />
            <Typography variant="body2" noWrap sx={{ flex: '1 1 auto' }}>
              {pendingFile.name}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {formatFileSize(pendingFile.size)}
            </Typography>
            <IconButton size="small" onClick={() => setPendingFile(null)} aria-label="Remove attachment">
              <X size={16} />
            </IconButton>
          </Box>
        )}
        <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 1 }}>
          <input ref={fileInputRef} type="file" accept={FILE_ACCEPT} hidden onChange={handleFileChange} />
          <Tooltip title="Attach image or PDF (max 10MB)">
            <IconButton onClick={() => fileInputRef.current?.click()} aria-label="Attach file">
              <Paperclip size={20} />
            </IconButton>
          </Tooltip>
          <TextField
            fullWidth
            multiline
            maxRows={6}
            size="small"
            placeholder={pendingFile ? 'Add a caption (optional)' : 'Type a message'}
            value={text}
            onChange={(e) => setText(e.target.value.slice(0, MAX_MESSAGE_LENGTH))}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
                e.preventDefault();
                handleSend();
              }
            }}
            helperText={text.length > MAX_MESSAGE_LENGTH - 200 ? `${text.length}/${MAX_MESSAGE_LENGTH}` : undefined}
            slotProps={{ htmlInput: { maxLength: MAX_MESSAGE_LENGTH } }}
          />
          <IconButton
            color="primary"
            onClick={handleSend}
            disabled={!text.trim() && !pendingFile}
            aria-label="Send"
          >
            <Send size={20} />
          </IconButton>
        </Box>
      </Box>

      <Dialog open={!!lightboxUrl} onClose={() => setLightboxUrl(null)} maxWidth="lg">
        {lightboxUrl && (
          <Box sx={{ position: 'relative', bgcolor: 'common.black' }}>
            <IconButton
              onClick={() => setLightboxUrl(null)}
              sx={{ position: 'absolute', top: 8, right: 8, color: 'common.white', bgcolor: 'rgba(0,0,0,0.4)' }}
              aria-label="Close"
            >
              <X size={20} />
            </IconButton>
            <Box
              component="img"
              src={lightboxUrl}
              alt="Attachment"
              sx={{ display: 'block', maxWidth: '90vw', maxHeight: '85vh', objectFit: 'contain' }}
            />
          </Box>
        )}
      </Dialog>
    </Box>
  );
}
