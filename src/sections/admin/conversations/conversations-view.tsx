import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import Chip from '@mui/material/Chip';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';

import { RefreshCw } from 'lucide-react';

import { DashboardContent } from 'src/layouts/dashboard';

import { Scrollbar } from 'src/components/scrollbar';
import { Breadcrumb } from 'src/components/breadcrumb';
import { TableNoData } from 'src/components/table-no-data';
import { useSnackbar } from 'src/components/snackbar';
import { useConversations } from 'src/hooks/useAdminApi';

import type { Conversation } from 'src/api/admin-types';

// ----------------------------------------------------------------------

export function ConversationsView() {
  const { showSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const table = useTable();

  const [filterName, setFilterName] = useState('');
  const [statusFilter, setStatusFilter] = useState<'' | 'active' | 'closed' | 'archived'>('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { conversations, loading, error, meta, refetch } = useConversations({
    status: statusFilter || undefined,
    search: filterName || undefined,
    page: table.page + 1,
    limit: table.rowsPerPage,
  });

  const handleManualRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await refetch();
      showSnackbar('Conversations refreshed', 'success');
    } catch (err: any) {
      showSnackbar(err.message || 'Failed to refresh', 'error');
    } finally {
      setIsRefreshing(false);
    }
  }, [refetch, showSnackbar]);

  const notFound = !conversations.length && !!filterName;

  const handleClearFilters = useCallback(() => {
    setFilterName('');
    setStatusFilter('');
    table.onResetPage();
  }, [table]);

  const handleRowClick = useCallback(
    (id: string) => {
      navigate(`/conversations/${id}`);
    },
    [navigate]
  );

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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <DashboardContent>
      <Breadcrumb
        title="Conversations"
        items={[
          { title: 'Dashboard', href: '/dashboard' },
          { title: 'Conversations' },
        ]}
      />

      <Card>
        <Box sx={{ p: 2, display: 'flex', gap: 2, alignItems: 'center' }}>
          <Box sx={{ flexGrow: 1 }}>
            <input
              type="text"
              placeholder="Search by name, phone, email, or subject..."
              value={filterName}
              onChange={(e) => {
                setFilterName(e.target.value);
                table.onResetPage();
              }}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #e0e0e0',
                borderRadius: '4px',
                fontSize: '14px',
              }}
            />
          </Box>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value as any);
              table.onResetPage();
            }}
            style={{
              padding: '8px 12px',
              border: '1px solid #e0e0e0',
              borderRadius: '4px',
              fontSize: '14px',
              minWidth: '120px',
            }}
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="closed">Closed</option>
            <option value="archived">Archived</option>
          </select>
          <IconButton onClick={handleManualRefresh} disabled={isRefreshing} title="Refresh">
            <RefreshCw style={{ width: 20, height: 20, ...(isRefreshing && { animation: 'spin 1s linear infinite' }) }} />
          </IconButton>
          {(filterName || statusFilter) && (
            <button
              onClick={handleClearFilters}
              style={{
                padding: '8px 16px',
                border: '1px solid #e0e0e0',
                borderRadius: '4px',
                background: 'white',
                cursor: 'pointer',
              }}
            >
              Clear
            </button>
          )}
        </Box>

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      <Box sx={{ py: 3 }}>Loading...</Box>
                    </TableCell>
                  </TableRow>
                ) : error ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      <Box sx={{ py: 3, color: 'error.main' }}>{error}</Box>
                    </TableCell>
                  </TableRow>
                ) : conversations.map((conversation) => (
                  <TableRow
                    key={conversation.id}
                    hover
                    sx={{ cursor: 'pointer' }}
                    onClick={() => handleRowClick(conversation.id)}
                  >
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{ width: 40, height: 40 }}>
                          {conversation.user_name.charAt(0).toUpperCase()}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" fontWeight="medium">
                            {conversation.user_name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {conversation.user_phone}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{conversation.user_email}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{conversation.subject}</Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                        {conversation.last_message_preview}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={conversation.status}
                        color={getStatusColor(conversation.status) as any}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {conversation.admin_unread_count > 0 && (
                          <Chip
                            label={conversation.admin_unread_count}
                            color="error"
                            size="small"
                            sx={{ height: 20 }}
                          />
                        )}
                        <Typography variant="caption" color="text.secondary">
                          {conversation.message_count} messages
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="caption" color="text.secondary">
                        {formatDate(conversation.last_message_at)}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}

                {notFound && <TableNoData searchQuery={filterName} onClearFilters={handleClearFilters} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          component="div"
          page={table.page}
          count={meta.total}
          rowsPerPage={table.rowsPerPage}
          onPageChange={table.onChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={table.onChangeRowsPerPage}
        />
      </Card>
    </DashboardContent>
  );
}

// ----------------------------------------------------------------------

export function useTable() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const onResetPage = useCallback(() => {
    setPage(0);
  }, []);

  const onChangePage = useCallback((event: unknown, newPage: number) => {
    setPage(newPage);
  }, []);

  const onChangeRowsPerPage = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      onResetPage();
    },
    [onResetPage]
  );

  return {
    page,
    rowsPerPage,
    onResetPage,
    onChangePage,
    onChangeRowsPerPage,
  };
}
