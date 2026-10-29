import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';

import { DashboardContent } from 'src/layouts/dashboard';

import { Breadcrumb } from 'src/components/breadcrumb';
import { getErrorMessage } from 'src/lib/utils';
import { adminConversationsService } from 'src/api/admin-services';

import type { Conversation, ConversationStatus } from 'src/api/admin-types';

import { ChatThread } from './chat-thread';
import { InboxList, type InboxTab } from './inbox-list';
import { useRefreshUnreadSummary, useUnreadSummary } from './use-unread-summary';
import { INBOX_PAGE_SIZE, INBOX_POLL_MS, sortConversations, useVisiblePolling } from './utils';
import { Iconify } from 'src/components/iconify';

export function SupportChatView() {
  const { conversationId } = useParams<{ conversationId?: string }>();
  const navigate = useNavigate();
  const { data: unreadSummary } = useUnreadSummary();
  const refreshUnreadSummary = useRefreshUnreadSummary();

  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [tab, setTab] = useState<InboxTab>('all');
  const [status, setStatus] = useState<'' | ConversationStatus>('');

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const requestSeqRef = useRef(0);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedSearch(search.trim()), 400);
    return () => window.clearTimeout(timer);
  }, [search]);

  const queryParams = useMemo(
    () => ({
      limit: INBOX_PAGE_SIZE,
      search: debouncedSearch || undefined,
      unread_only: tab === 'unread' || undefined,
      status: status || undefined,
    }),
    [debouncedSearch, tab, status]
  );

  const loadFirstPage = useCallback(async () => {
    const seq = ++requestSeqRef.current;
    setLoading(true);
    setError(null);
    try {
      const res = await adminConversationsService.getConversations({ ...queryParams, page: 1 });
      if (seq !== requestSeqRef.current) return;
      setConversations(res.data);
      setPage(1);
      setHasMore(res.meta.hasNext);
    } catch (err) {
      if (seq !== requestSeqRef.current) return;
      setError(getErrorMessage(err, 'Failed to load conversations.'));
    } finally {
      if (seq === requestSeqRef.current) setLoading(false);
    }
  }, [queryParams]);

  useEffect(() => {
    setConversations([]);
    loadFirstPage();
  }, [loadFirstPage]);

  const loadMore = useCallback(async () => {
    if (loadingMore || loading || !hasMore) return;
    const seq = requestSeqRef.current;
    const nextPage = page + 1;
    setLoadingMore(true);
    try {
      const res = await adminConversationsService.getConversations({ ...queryParams, page: nextPage });
      if (seq !== requestSeqRef.current) return;
      setConversations((prev) => {
        const seen = new Set(prev.map((c) => c.id));
        return [...prev, ...res.data.filter((c) => !seen.has(c.id))];
      });
      setPage(nextPage);
      setHasMore(res.meta.hasNext);
    } catch {
      // The sentinel will trigger another attempt on the next scroll.
    } finally {
      setLoadingMore(false);
    }
  }, [hasMore, loading, loadingMore, page, queryParams]);

  const pollInbox = useCallback(async () => {
    const seq = requestSeqRef.current;
    try {
      const res = await adminConversationsService.getConversations({ ...queryParams, page: 1 });
      if (seq !== requestSeqRef.current) return;
      setConversations((prev) => {
        const byId = new Map(prev.map((c) => [c.id, c]));
        res.data.forEach((c) => byId.set(c.id, c));
        return sortConversations(Array.from(byId.values()));
      });
    } catch {
      // Silent; retried on the next tick.
    }
  }, [queryParams]);

  useVisiblePolling(pollInbox, INBOX_POLL_MS, !loading);

  const upsertConversation = useCallback((conversation: Conversation) => {
    setConversations((prev) => {
      const exists = prev.some((c) => c.id === conversation.id);
      if (!exists && !conversation.last_message_at) return prev;
      const next = exists ? prev.map((c) => (c.id === conversation.id ? conversation : c)) : [conversation, ...prev];
      return sortConversations(next);
    });
  }, []);

  const handleMarkedRead = useCallback(
    (id: string) => {
      setConversations((prev) => prev.map((c) => (c.id === id && c.admin_unread_count ? { ...c, admin_unread_count: 0 } : c)));
      refreshUnreadSummary();
    },
    [refreshUnreadSummary]
  );

  const handleSelect = useCallback(
    (conversation: Conversation) => {
      navigate(`/support-chat/${conversation.id}`);
    },
    [navigate]
  );

  const handleBack = useCallback(() => navigate('/support-chat'), [navigate]);

  const selectedConversation = useMemo(
    () => conversations.find((c) => c.id === conversationId),
    [conversations, conversationId]
  );

  return (
    <DashboardContent
      sx={{
        pb: 2,
        height: {
          xs: 'calc(100dvh - var(--layout-header-mobile-height))',
          md: 'calc(100dvh - var(--layout-header-desktop-height))',
        },
      }}
    >
      <Breadcrumb
        title="Support chat"
        items={[{ title: 'Dashboard', href: '/dashboard' }, { title: 'Support chat' }]}
      />

      <Card
        sx={{
          display: 'flex',
          flex: '1 1 auto',
          overflow: 'hidden',
          border: 1,
          borderColor: 'divider',
          borderRadius: 2.5,
          boxShadow: '0 24px 48px -24px rgba(15, 23, 42, 0.18)',
          minHeight: 480,
        }}
      >
        <Box
          sx={{
            width: { xs: 1, md: 360, lg: 380 },
            flexShrink: 0,
            borderRight: { md: 1 },
            borderColor: { md: 'divider' },
            display: { xs: conversationId ? 'none' : 'flex', md: 'flex' },
            flexDirection: 'column',
            minHeight: 0,
          }}
        >
          <InboxList
            conversations={conversations}
            selectedId={conversationId}
            search={search}
            onSearchChange={setSearch}
            tab={tab}
            onTabChange={setTab}
            status={status}
            onStatusChange={setStatus}
            unreadConversations={unreadSummary?.unread_conversations ?? 0}
            loading={loading}
            loadingMore={loadingMore}
            hasMore={hasMore}
            error={error}
            onRetry={loadFirstPage}
            onLoadMore={loadMore}
            onSelect={handleSelect}
          />
        </Box>

        <Box
          sx={{
            flex: '1 1 auto',
            minWidth: 0,
            display: { xs: conversationId ? 'flex' : 'none', md: 'flex' },
            flexDirection: 'column',
          }}
        >
          {conversationId ? (
            <ChatThread
              conversationId={conversationId}
              initialConversation={selectedConversation}
              onConversationChange={upsertConversation}
              onMarkedRead={handleMarkedRead}
              onBack={handleBack}
            />
          ) : (
            <Box
              sx={(theme) => ({
                height: 1,
                px: 3,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                gap: 1,
                color: 'text.secondary',
                bgcolor: theme.vars.palette.background.neutral,
                backgroundImage: `radial-gradient(${theme.vars.palette.divider} 1px, transparent 1px)`,
                backgroundSize: '18px 18px',
              })}
            >
              <Box
                sx={{
                  mb: 1.5,
                  width: 96,
                  height: 96,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '50%',
                  color: 'primary.main',
                  bgcolor: 'primary.lighter',
                  boxShadow: (theme) => `0 0 0 12px ${theme.vars.palette.background.paper}`,
                }}
              >
                <Iconify icon="solar:chat-round-dots-bold-duotone" width={48} />
              </Box>
              <Typography variant="h6" sx={{ color: 'text.primary' }}>
                Select a conversation
              </Typography>
              <Typography variant="body2" sx={{ maxWidth: 360 }}>
                Choose a user from the inbox to view and reply to their messages.
              </Typography>
            </Box>
          )}
        </Box>
      </Card>
    </DashboardContent>
  );
}
