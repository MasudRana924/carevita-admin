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

import type { Conversation, ConversationStatus } from 'src/api/admin-types';

import { displayName, formatInboxTime } from './utils';
import { Iconify } from 'src/components/iconify';

export type InboxTab = 'all' | 'unread';

const PILL_FIELD_SX = {
  '& .MuiOutlinedInput-root': {
    borderRadius: 1.5,
    bgcolor: 'background.neutral',
    '& fieldset': { borderColor: 'transparent' },
    '&:hover fieldset': { borderColor: 'divider' },
  },
} as const;

function CountPill({ value, color }: { value: number; color: string }) {
  return (
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
        bgcolor: color,
        color: 'common.white',
      }}
    >
      {value > 99 ? '99+' : value}
    </Box>
  );
}

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
      <Box sx={{ px: 2.5, pt: 2.5, pb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              flexShrink: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 1.25,
              color: 'primary.main',
              bgcolor: 'primary.lighter',
            }}
          >
            <Iconify icon="solar:chat-round-dots-bold-duotone" width={22} />
          </Box>
          <Box sx={{ flex: '1 1 auto', minWidth: 0 }}>
            <Typography variant="subtitle1">Inbox</Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              {unreadConversations > 0 ? `${unreadConversations} unread conversation${unreadConversations > 1 ? 's' : ''}` : 'All caught up'}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', gap: 1 }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Search name, phone or email"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            sx={PILL_FIELD_SX}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Iconify icon="solar:magnifer-linear" width={18} sx={{ color: 'text.disabled' }} />
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
            sx={[PILL_FIELD_SX, { minWidth: 118 }]}
            slotProps={{ select: { displayEmpty: true } }}
          >
            <MenuItem value="">Any status</MenuItem>
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="closed">Closed</MenuItem>
            <MenuItem value="archived">Archived</MenuItem>
          </TextField>
        </Box>

        <Tabs
          value={tab}
          onChange={(_, value) => onTabChange(value)}
          variant="fullWidth"
          sx={{
            mt: 2,
            p: 0.5,
            minHeight: 0,
            borderRadius: 1.5,
            bgcolor: 'background.neutral',
            '& .MuiTabs-indicator': {
              height: 1,
              borderRadius: 1.25,
              bgcolor: 'background.paper',
              boxShadow: '0 1px 4px rgba(15, 23, 42, 0.12)',
            },
            '& .MuiTab-root': { zIndex: 1, minHeight: 34, py: 0.5, mr: '0 !important' },
          }}
        >
          <Tab value="all" label="All" />
          <Tab
            value="unread"
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                Unread
                {unreadConversations > 0 && <CountPill value={unreadConversations} color="error.main" />}
              </Box>
            }
          />
        </Tabs>
      </Box>

      <Box ref={scrollRef} sx={{ flex: '1 1 auto', overflowY: 'auto', minHeight: 0, px: 1, pb: 1 }}>
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
            <Iconify icon="solar:chat-round-dots-bold-duotone" width={32} style={{ opacity: 0.4 }} />
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
      sx={{
        px: 1.5,
        py: 1.25,
        mb: 0.5,
        gap: 1.5,
        borderRadius: 1.5,
        alignItems: 'center',
        transition: 'background-color 160ms ease',
        '&.Mui-selected': {
          bgcolor: 'primary.lighter',
          '&:hover': { bgcolor: 'primary.lighter' },
        },
      }}
    >
      <Badge
        overlap="circular"
        variant="dot"
        color="error"
        invisible={!unread}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        sx={{ '& .MuiBadge-dot': { width: 12, height: 12, borderRadius: '50%', border: '2px solid', borderColor: 'background.paper' } }}
      >
        <Avatar
          src={conversation.user_photo || undefined}
          alt={name}
          sx={{
            width: 46,
            height: 46,
            fontWeight: 600,
            color: 'primary.dark',
            bgcolor: 'primary.lighter',
            outline: unread ? '2px solid' : 'none',
            outlineColor: 'primary.main',
            outlineOffset: 2,
          }}
        >
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
          {unread && <CountPill value={conversation.admin_unread_count} color="primary.main" />}
        </Box>
      </Box>
    </ListItemButton>
  );
});
