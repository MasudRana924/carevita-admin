import { useState, useCallback, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import { ArrowLeft, Send, RefreshCw } from 'lucide-react';

import { DashboardContent } from 'src/layouts/dashboard';

import { Scrollbar } from 'src/components/scrollbar';
import { Breadcrumb } from 'src/components/breadcrumb';
import { useSnackbar } from 'src/components/snackbar';
import { useConversation, useConversationMessages } from 'src/hooks/useAdminApi';

import type { ConversationStatus } from 'src/api/admin-types';

// ----------------------------------------------------------------------

export function ConversationDetailView() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const hasMarkedAsRead = useRef(false);

  const [messageText, setMessageText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { conversation, loading: conversationLoading, updateStatus, refetch: refetchConversation } = useConversation(id || '');
  const { messages, loading: messagesLoading, reply, markAsRead, refetch: refetchMessages } = useConversationMessages(id || '');

  // Mark messages as read on mount (only once)
  useEffect(() => {
    if (id && !hasMarkedAsRead.current) {
      markAsRead();
      hasMarkedAsRead.current = true;
    }
  }, [id]);

  const handleManualRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([refetchMessages(), refetchConversation()]);
      showSnackbar('Conversation refreshed', 'success');
    } catch (err: any) {
      showSnackbar(err.message || 'Failed to refresh', 'error');
    } finally {
      setIsRefreshing(false);
    }
  }, [refetchMessages, refetchConversation, showSnackbar]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = useCallback(async () => {
    if (!messageText.trim() || !id) return;
    setIsSending(true);
    try {
      await reply({ message_type: 'text', message: messageText });
      setMessageText('');
      showSnackbar('Reply sent successfully', 'success');
    } catch (err: any) {
      showSnackbar(err.message || 'Failed to send reply', 'error');
    } finally {
      setIsSending(false);
    }
  }, [messageText, id, reply, showSnackbar]);

  const handleStatusChange = useCallback(
    async (status: ConversationStatus) => {
      if (!id) return;
      try {
        await updateStatus({ status });
        showSnackbar('Status updated successfully', 'success');
      } catch (err: any) {
        showSnackbar(err.message || 'Failed to update status', 'error');
      }
    },
    [id, updateStatus, showSnackbar]
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'closed':
        return 'default';
      case 'archived':
        return 'secondary';
      default:
        return 'default';
    }
  };

  if (conversationLoading) {
    return (
      <DashboardContent>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <Typography>Loading conversation...</Typography>
        </Box>
      </DashboardContent>
    );
  }

  if (!conversation) {
    return (
      <DashboardContent>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <Typography>Conversation not found</Typography>
        </Box>
      </DashboardContent>
    );
  }

  return (
    <DashboardContent>
      <Breadcrumb
        title="Conversation Details"
        items={[
          { title: 'Dashboard', href: '/dashboard' },
          { title: 'Conversations', href: '/conversations' },
          { title: conversation.subject },
        ]}
      />

      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Button startIcon={<ArrowLeft />} onClick={() => navigate('/conversations')}>
          Back to Conversations
        </Button>
        <IconButton onClick={handleManualRefresh} disabled={isRefreshing} title="Refresh">
          <RefreshCw style={{ width: 20, height: 20, ...(isRefreshing && { animation: 'spin 1s linear infinite' }) }} />
        </IconButton>
      </Box>

      <Card sx={{ mb: 3 }}>
        <CardHeader
          title={
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography variant="h5">{conversation.subject}</Typography>
              <Chip
                label={conversation.status}
                color={getStatusColor(conversation.status) as any}
                size="small"
              />
            </Box>
          }
          subheader={
            <Box sx={{ mt: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Avatar sx={{ width: 48, height: 48 }}>
                  {conversation.user_name.charAt(0).toUpperCase()}
                </Avatar>
                <Box>
                  <Typography variant="subtitle1" fontWeight="medium">
                    {conversation.user_name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {conversation.user_email}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {conversation.user_phone}
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                <Typography variant="caption" color="text.secondary">
                  Created: {formatDate(conversation.created_at)}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Last updated: {formatDate(conversation.updated_at)}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {conversation.message_count} messages
                </Typography>
              </Box>
            </Box>
          }
          action={
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Status</InputLabel>
              <Select
                value={conversation.status}
                label="Status"
                onChange={(e) => handleStatusChange(e.target.value as ConversationStatus)}
              >
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="closed">Closed</MenuItem>
                <MenuItem value="archived">Archived</MenuItem>
              </Select>
            </FormControl>
          }
        />
      </Card>

      <Card>
        <CardContent>
          <Box sx={{ height: 'calc(100vh - 400px)', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ flexGrow: 1, overflow: 'auto', mb: 2 }}>
              {messagesLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
                  <Typography>Loading messages...</Typography>
                </Box>
              ) : messages.length === 0 ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
                  <Typography color="text.secondary">No messages yet</Typography>
                </Box>
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {messages.map((message) => (
                    <Box
                      key={message.id}
                      sx={{
                        display: 'flex',
                        justifyContent: message.sender_role === 'admin' ? 'flex-end' : 'flex-start',
                      }}
                    >
                      <Paper
                        sx={{
                          p: 2,
                          maxWidth: '70%',
                          bgcolor: message.sender_role === 'admin' ? 'primary.main' : 'grey.100',
                          color: message.sender_role === 'admin' ? 'white' : 'text.primary',
                        }}
                      >
                        <Typography variant="body2" sx={{ wordBreak: 'break-word' }}>
                          {message.message}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 1, mt: 1 }}>
                          <Typography variant="caption" sx={{ opacity: 0.7 }}>
                            {formatDate(message.created_at)}
                          </Typography>
                          {message.is_read && (
                            <Typography variant="caption" sx={{ opacity: 0.7 }}>
                              ✓ Read
                            </Typography>
                          )}
                        </Box>
                      </Paper>
                    </Box>
                  ))}
                  <div ref={messagesEndRef} />
                </Box>
              )}
            </Box>

            {conversation.status === 'active' && (
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-end' }}>
                <TextField
                  fullWidth
                  multiline
                  maxRows={4}
                  placeholder="Type your reply..."
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  disabled={isSending}
                />
                <IconButton
                  onClick={handleSendMessage}
                  disabled={!messageText.trim() || isSending}
                  color="primary"
                  sx={{ mb: 0.5 }}
                >
                  <Send />
                </IconButton>
              </Box>
            )}
          </Box>
        </CardContent>
      </Card>
    </DashboardContent>
  );
}
