import { memo, useEffect, useMemo } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';
import { AlertCircle, Check, CheckCheck, Clock, FileText } from 'lucide-react';

import { formatFileSize, formatMessageTime, type ChatMessage } from './utils';

type Props = {
  message: ChatMessage;
  onImageClick: (url: string) => void;
  onRetry: (message: ChatMessage) => void;
};

function MessageBubbleBase({ message, onImageClick, onRetry }: Props) {
  const isAdmin = message.sender_role === 'admin';

  const localPreviewUrl = useMemo(
    () =>
      message.local_file && message.local_file.type.startsWith('image/')
        ? URL.createObjectURL(message.local_file)
        : null,
    [message.local_file]
  );

  useEffect(
    () => () => {
      if (localPreviewUrl) URL.revokeObjectURL(localPreviewUrl);
    },
    [localPreviewUrl]
  );

  const imageUrl = message.message_type === 'image' ? message.attachment_url || localPreviewUrl : null;
  const fileName = message.attachment_name || message.local_file?.name || 'Document';
  const fileSize = formatFileSize(message.attachment_size ?? message.local_file?.size);

  const renderStatus = () => {
    if (!isAdmin) return null;
    if (message.local_status === 'sending') return <Clock size={14} />;
    if (message.local_status === 'failed') return <AlertCircle size={14} />;
    return message.is_read ? <CheckCheck size={15} color="#34B7F1" /> : <Check size={15} />;
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: isAdmin ? 'flex-end' : 'flex-start',
        mb: 1,
      }}
    >
      <Box
        sx={(theme) => ({
          maxWidth: { xs: '85%', md: '65%' },
          px: 1.5,
          py: 1,
          borderRadius: 2,
          borderTopRightRadius: isAdmin ? 4 : 16,
          borderTopLeftRadius: isAdmin ? 16 : 4,
          bgcolor: isAdmin ? theme.vars.palette.primary.lighter : theme.vars.palette.background.paper,
          color: 'text.primary',
          boxShadow: '0 1px 1px rgba(0,0,0,0.08)',
          opacity: message.local_status === 'sending' ? 0.8 : 1,
          wordBreak: 'break-word',
        })}
      >
        {message.message_type === 'image' && imageUrl && (
          <Box
            component="img"
            src={imageUrl}
            alt={fileName}
            onClick={() => message.attachment_url && onImageClick(message.attachment_url)}
            sx={{
              display: 'block',
              maxWidth: '100%',
              width: 260,
              maxHeight: 280,
              objectFit: 'cover',
              borderRadius: 1.5,
              cursor: message.attachment_url ? 'zoom-in' : 'default',
              mb: message.message ? 0.75 : 0,
            }}
          />
        )}

        {message.message_type === 'document' && (
          <Box
            component={message.attachment_url ? 'a' : 'div'}
            href={message.attachment_url || undefined}
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.25,
              p: 1,
              mb: message.message ? 0.75 : 0,
              borderRadius: 1.5,
              bgcolor: 'rgba(0,0,0,0.04)',
              color: 'inherit',
              textDecoration: 'none',
              minWidth: 200,
              '&:hover': message.attachment_url ? { bgcolor: 'rgba(0,0,0,0.08)' } : undefined,
            }}
          >
            <Box
              sx={{
                width: 40,
                height: 40,
                flexShrink: 0,
                borderRadius: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'error.main',
                color: 'common.white',
              }}
            >
              <FileText size={20} />
            </Box>
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="body2" fontWeight={600} noWrap title={fileName}>
                {fileName}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {['PDF', fileSize].filter(Boolean).join(' · ')}
              </Typography>
            </Box>
          </Box>
        )}

        {message.message && (
          <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
            {message.message}
          </Typography>
        )}

        {message.local_status === 'sending' && message.local_file && (
          <LinearProgress
            variant={message.upload_progress ? 'determinate' : 'indeterminate'}
            value={message.upload_progress ?? 0}
            sx={{ mt: 0.75, borderRadius: 1 }}
          />
        )}

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: 0.5,
            mt: 0.25,
            color: 'text.secondary',
          }}
        >
          <Typography variant="caption" sx={{ fontSize: 11 }}>
            {formatMessageTime(message.created_at)}
          </Typography>
          {renderStatus()}
        </Box>
      </Box>

      {isAdmin && message.local_status === 'failed' ? (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.25 }}>
          <Typography variant="caption" color="error.main">
            Not sent
          </Typography>
          <Button size="small" color="error" onClick={() => onRetry(message)} sx={{ minWidth: 0, py: 0 }}>
            Retry
          </Button>
        </Box>
      ) : (
        isAdmin &&
        message.sender_name &&
        !message.local_status && (
          <Typography variant="caption" color="text.disabled" sx={{ mt: 0.25, fontSize: 11 }}>
            by {message.sender_name}
          </Typography>
        )
      )}
    </Box>
  );
}

export const MessageBubble = memo(MessageBubbleBase);
