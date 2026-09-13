import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import List from '@mui/material/List';
import Badge from '@mui/material/Badge';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

import { fToNow } from 'src/utils/format-time';

import { DashboardContent } from 'src/layouts/dashboard';
import { Breadcrumb } from 'src/components/breadcrumb';
import { Scrollbar } from 'src/components/scrollbar';
import { LucideIcon } from 'src/components/lucide-icons';

import { _notifications } from 'src/_mock';

// ----------------------------------------------------------------------

type NotificationItemProps = {
  id: string;
  type: string;
  title: string;
  isUnRead: boolean;
  description: string;
  avatarUrl: string | null;
  postedAt: string | number | null;
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(_notifications);
  const [filter, setFilter] = useState('all');

  const totalUnRead = notifications.filter((item) => item.isUnRead === true).length;

  const handleFilterChange = useCallback((event: React.MouseEvent<HTMLElement>, newFilter: string) => {
    if (newFilter !== null) {
      setFilter(newFilter);
    }
  }, []);

  const handleMarkAllAsRead = useCallback(() => {
    const updatedNotifications = notifications.map((notification) => ({
      ...notification,
      isUnRead: false,
    }));
    setNotifications(updatedNotifications);
  }, [notifications]);

  const handleMarkAsRead = useCallback((id: string) => {
    const updatedNotifications = notifications.map((notification) =>
      notification.id === id ? { ...notification, isUnRead: false } : notification
    );
    setNotifications(updatedNotifications);
  }, [notifications]);

  const handleDeleteNotification = useCallback((id: string) => {
    const updatedNotifications = notifications.filter((notification) => notification.id !== id);
    setNotifications(updatedNotifications);
  }, [notifications]);

  const filteredNotifications = notifications.filter((notification) => {
    if (filter === 'all') return true;
    if (filter === 'unread') return notification.isUnRead;
    if (filter === 'read') return !notification.isUnRead;
    return true;
  });

  const unreadNotifications = filteredNotifications.filter((item) => item.isUnRead);
  const readNotifications = filteredNotifications.filter((item) => !item.isUnRead);

  return (
    <DashboardContent>
      <Box sx={{ mb: 5 }}>
        <Breadcrumb 
          title="Notifications" 
          items={[
            { title: 'Dashboard', href: '/dashboard' },
            { title: 'Notifications' }
          ]} 
        />
      </Box>

      <Card sx={{ 
        p: 3, 
        border: '1px solid #E0E0E0',
        borderRadius: 2,
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
      }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
              Notifications
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              You have {totalUnRead} unread messages
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <ToggleButtonGroup
              value={filter}
              exclusive
              onChange={handleFilterChange}
              size="small"
              sx={{ height: 36 }}
            >
              <ToggleButton value="all">All</ToggleButton>
              <ToggleButton value="unread">
                <Badge badgeContent={totalUnRead} color="error" sx={{ mr: 1 }}>
                  Unread
                </Badge>
              </ToggleButton>
              <ToggleButton value="read">Read</ToggleButton>
            </ToggleButtonGroup>

            {totalUnRead > 0 && (
              <Tooltip title="Mark all as read">
                <Button
                  variant="outlined"
                  size="small"
                  onClick={handleMarkAllAsRead}
                  startIcon={<LucideIcon icon="eva:done-all-fill" />}
                >
                  Mark all read
                </Button>
              </Tooltip>
            )}
          </Box>
        </Box>

        <Divider sx={{ mb: 3 }} />

        <Scrollbar sx={{ maxHeight: 600 }}>
          {unreadNotifications.length > 0 && (
            <List
              disablePadding
              subheader={
                <ListSubheader disableSticky sx={{ py: 1, px: 0, typography: 'overline', color: 'primary.main' }}>
                  Unread ({unreadNotifications.length})
                </ListSubheader>
              }
            >
              {unreadNotifications.map((notification) => (
                <NotificationItem 
                  key={notification.id} 
                  notification={notification}
                  onMarkAsRead={handleMarkAsRead}
                  onDelete={handleDeleteNotification}
                />
              ))}
            </List>
          )}

          {readNotifications.length > 0 && (
            <List
              disablePadding
              subheader={
                <ListSubheader disableSticky sx={{ py: 1, px: 0, typography: 'overline', color: 'text.secondary' }}>
                  Read ({readNotifications.length})
                </ListSubheader>
              }
            >
              {readNotifications.map((notification) => (
                <NotificationItem 
                  key={notification.id} 
                  notification={notification}
                  onMarkAsRead={handleMarkAsRead}
                  onDelete={handleDeleteNotification}
                />
              ))}
            </List>
          )}

          {filteredNotifications.length === 0 && (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <LucideIcon 
                icon="solar:bell-off-bold-duotone" 
                width={64} 
                sx={{ color: 'text.disabled', mb: 2 }} 
              />
              <Typography variant="h6" sx={{ color: 'text.secondary', mb: 1 }}>
                No notifications
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.disabled' }}>
                {filter === 'all' 
                  ? 'You\'re all caught up!' 
                  : filter === 'unread' 
                    ? 'No unread notifications' 
                    : 'No read notifications'
                }
              </Typography>
            </Box>
          )}
        </Scrollbar>
      </Card>
    </DashboardContent>
  );
}

// ----------------------------------------------------------------------

function NotificationItem({ 
  notification, 
  onMarkAsRead, 
  onDelete 
}: { 
  notification: NotificationItemProps;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  const { avatarUrl, title } = renderContent(notification);

  return (
    <ListItemButton
      sx={{
        py: 2,
        px: 0,
        mt: '1px',
        borderRadius: 1,
        ...(notification.isUnRead && {
          bgcolor: 'action.selected',
        }),
        '&:hover': {
          bgcolor: 'action.hover',
        },
      }}
    >
      <ListItemAvatar>
        <Avatar sx={{ bgcolor: 'background.neutral' }}>{avatarUrl}</Avatar>
      </ListItemAvatar>
      
      <ListItemText
        primary={title}
        secondary={
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 0.5 }}>
            <Typography
              variant="caption"
              sx={{
                gap: 0.5,
                display: 'flex',
                alignItems: 'center',
                color: 'text.disabled',
              }}
            >
              <LucideIcon width={14} icon="solar:clock-circle-outline" />
              {fToNow(notification.postedAt)}
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 0.5 }}>
              {notification.isUnRead && (
                <Tooltip title="Mark as read">
                  <IconButton 
                    size="small" 
                    onClick={(e) => {
                      e.stopPropagation();
                      onMarkAsRead(notification.id);
                    }}
                  >
                    <LucideIcon icon="eva:checkmark-fill" width={16} />
                  </IconButton>
                </Tooltip>
              )}
              
              <Tooltip title="Delete notification">
                <IconButton 
                  size="small" 
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(notification.id);
                  }}
                  sx={{ color: 'error.main' }}
                >
                  <LucideIcon icon="solar:trash-bin-trash-bold" width={16} />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        }
      />
    </ListItemButton>
  );
}

// ----------------------------------------------------------------------

function renderContent(notification: NotificationItemProps) {
  const title = (
    <Typography variant="subtitle2">
      {notification.title}
      <Typography component="span" variant="body2" sx={{ color: 'text.secondary' }}>
        &nbsp; {notification.description}
      </Typography>
    </Typography>
  );

  if (notification.type === 'order-placed') {
    return {
      avatarUrl: (
        <img
          alt={notification.title}
          src="/assets/icons/notification/ic-notification-package.svg"
        />
      ),
      title,
    };
  }
  if (notification.type === 'order-shipped') {
    return {
      avatarUrl: (
        <img
          alt={notification.title}
          src="/assets/icons/notification/ic-notification-shipping.svg"
        />
      ),
      title,
    };
  }
  if (notification.type === 'mail') {
    return {
      avatarUrl: (
        <img alt={notification.title} src="/assets/icons/notification/ic-notification-mail.svg" />
      ),
      title,
    };
  }
  if (notification.type === 'chat-message') {
    return {
      avatarUrl: (
        <img alt={notification.title} src="/assets/icons/notification/ic-notification-chat.svg" />
      ),
      title,
    };
  }
  return {
    avatarUrl: notification.avatarUrl ? (
      <img alt={notification.title} src={notification.avatarUrl} />
    ) : null,
    title,
  };
}
