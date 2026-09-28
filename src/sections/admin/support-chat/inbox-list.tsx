import { memo, useCallback, useEffect, useRef } from 'react';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Badge from '@mui/material/Badge';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';
import CircularProgress from '@mui/material/CircularProgress';
import ListItemButton from '@mui/material/ListItemButton';
import { MessageSquare, Search } from 'lucide-react';

import type { Conversation, ConversationStatus } from 'src/api/admin-types';

import { displayName, formatInboxTime } from './utils';

export type InboxTab = 'all' | 'unread';

type Props = {
  conversations: Conversation[];
  selectedId?: string;
  search: string;
  onSearchChange: (value: string) => void;
  tab: InboxTab;
  onTabChange: (tab: InboxTab) => void;
  status: '' | ConversationStatus;
  onStatusChange: (status: '' | ConversationStatus) => void;
  unreadConversations: number;
  loading: boolean;
  loadingMore: boolean;
  hasMore: boolean;
  error: string | null;
  onRetry: () => void;
  onLoadMore: () => void;
  onSelect: (conversation: Conversation) => void;
};

export function InboxList({
  conversations,
  selectedId,
  search,
  onSearchChange,
  tab,
  onTabChange,
  status,
  onStatusChange,
  unreadConversations,
  loading,
  loadingMore,
  hasMore,
  error,
  onRetry,
  onLoadMore,
  onSelect,
}: Props) {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node || !hasMore) return undefined;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) onLoadMore();
      },
      { root: scrollRef.current, rootMargin: '120px' }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [hasMore, onLoadMore, conversations.length]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: 1, minHeight: 0 }}>
      <Box sx={{ p: 2, pb: 1 }}>
        <Typography variant="h6" sx={{ mb: 1.5 }}>
          Support Chat
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Search name, phone or email"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Search size={18} />
                  </InputAdornment>
                ),
              },
            }}
          />
          <TextField
            select
            size="small"
            value={status}
            onChange={(e) => onStatusChange(e.target.value as '' | ConversationStatus)}
            sx={{ minWidth: 110 }}
            slotProps={{ select: { displayEmpty: true } }}
          >
            <MenuItem value="">Any status</MenuItem>
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="closed">Closed</MenuItem>
            <MenuItem value="archived">Archived</MenuItem>
          </TextField>
        </Box>
      </Box>

      <Tabs
        value={tab}
        onChange={(_, value) => onTabChange(value)}
        sx={{ px: 2, minHeight: 40, borderBottom: 1, borderColor: 'divider' }}
      >
        <Tab value="all" label="All" sx={{ minHeight: 40 }} />
        <Tab
          value="unread"
          sx={{ minHeight: 40 }}
          label={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              Unread
              {unreadConversations > 0 && (
                <Box
                  component="span"
                  sx={{
                    px: 0.75,
                    minWidth: 20,
                    height: 20,
                    lineHeight: '20px',
                    borderRadius: 10,
                    fontSize: 12,
                    bgcolor: 'error.main',
                    color: 'common.white',
                  }}
                >
                  {unreadConversations}
                </Box>
              )}
            </Box>
          }
        />
      </Tabs>

      <Box ref={scrollRef} sx={{ flex: '1 1 auto', overflowY: 'auto', minHeight: 0 }}>
        {loading && !conversations.length ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
            <CircularProgress size={28} />
          </Box>
        ) : error && !conversations.length ? (
          <Box sx={{ textAlign: 'center', py: 6, px: 2 }}>
            <Typography variant="body2" color="error.main" sx={{ mb: 1 }}>
              {error}
            </Typography>
            <Button size="small" onClick={onRetry}>
              Retry
            </Button>
          </Box>
        ) : !conversations.length ? (
          <Box sx={{ textAlign: 'center', py: 6, px: 2, color: 'text.secondary' }}>
            <MessageSquare size={32} style={{ opacity: 0.4 }} />
            <Typography variant="body2" sx={{ mt: 1 }}>
              {search ? 'No conversations match your search.' : tab === 'unread' ? 'No unread conversations.' : 'No conversations yet.'}
            </Typography>
          </Box>
        ) : (
          <>
            {conversations.map((conversation) => (
              <InboxRow
                key={conversation.id}
                conversation={conversation}
                selected={conversation.id === selectedId}
                onSelect={onSelect}
              />
            ))}
            <div ref={sentinelRef} />
            {loadingMore && (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
                <CircularProgress size={20} />
              </Box>
            )}
          </>
        )}
      </Box>
    </Box>
  );
}

type RowProps = {
  conversation: Conversation;
  selected: boolean;
  onSelect: (conversation: Conversation) => void;
};

const InboxRow = memo(function InboxRow({ conversation, selected, onSelect }: RowProps) {
  const unread = conversation.admin_unread_count > 0;
  const name = displayName(conversation);
  const preview = conversation.last_message_preview || '';
  const handleClick = useCallback(() => onSelect(conversation), [onSelect, conversation]);

  return (
    <ListItemButton
      selected={selected}
      onClick={handleClick}
      sx={{ px: 2, py: 1.25, gap: 1.5, alignItems: 'center', borderBottom: 1, borderColor: 'divider' }}
    >
      <Badge
        overlap="circular"
        variant="dot"
        color="error"
        invisible={!unread}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Avatar src={conversation.user_photo || undefined} alt={name} sx={{ width: 44, height: 44 }}>
          {name.charAt(0).toUpperCase()}
        </Avatar>
      </Badge>

      <Box sx={{ flex: '1 1 auto', minWidth: 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
          <Typography variant="subtitle2" noWrap sx={{ flex: '1 1 auto', fontWeight: unread ? 700 : 600 }}>
            {name}
          </Typography>
          <Typography
            variant="caption"
            sx={{ flexShrink: 0, color: unread ? 'primary.main' : 'text.disabled', fontWeight: unread ? 700 : 400 }}
          >
            {formatInboxTime(conversation.last_message_at)}
          </Typography>
        </Box>
        {conversation.user_phone && conversation.user_name && (
          <Typography variant="caption" color="text.disabled" noWrap component="div">
            {conversation.user_phone}
          </Typography>
        )}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography
            variant="body2"
            noWrap
            sx={{
              flex: '1 1 auto',
              color: unread ? 'text.primary' : 'text.secondary',
              fontWeight: unread ? 600 : 400,
            }}
          >
            {conversation.last_message_sender_role === 'admin' ? 'You: ' : ''}
            {preview}
          </Typography>
          {unread && (
            <Box
              component="span"
              sx={{
                flexShrink: 0,
                px: 0.75,
                minWidth: 20,
                height: 20,
                lineHeight: '20px',
                textAlign: 'center',
                borderRadius: 10,
                fontSize: 12,
                fontWeight: 700,
                bgcolor: 'primary.main',
                color: 'common.white',
              }}
            >
              {conversation.admin_unread_count > 99 ? '99+' : conversation.admin_unread_count}
            </Box>
          )}
        </Box>
      </Box>
    </ListItemButton>
  );
});
