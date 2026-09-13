import type { _orders } from 'src/_mock';

import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Checkbox from '@mui/material/Checkbox';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';

import { useRouter } from 'src/routes/hooks';

import { Label } from 'src/components/label';
import { LucideIcon } from 'src/components/lucide-icons';

// ----------------------------------------------------------------------

export type OrderProps = typeof _orders[0];

type OrderTableRowProps = {
  row: OrderProps;
  selected: boolean;
  onSelectRow: VoidFunction;
};

export function OrderTableRow({ row, selected, onSelectRow }: OrderTableRowProps) {
  const theme = useTheme();
  const router = useRouter();
  const [status, setStatus] = useState(row.status);

  const handleStatusChange = useCallback((newStatus: string) => {
    setStatus(newStatus);
    // Here you would typically make an API call to update the order status
    console.log(`Order ${row.orderNumber} status changed to ${newStatus}`);
  }, [row.orderNumber]);

  const handleViewDetails = useCallback(() => {
    router.push(`/dashboard/orders/${row.id}`);
  }, [router, row.id]);

  const getStatusColor = (statusValue: string) => {
    switch (statusValue) {
      case 'pending':
        return 'warning';
      case 'pickup':
        return 'info';
      case 'delivered':
        return 'success';
      default:
        return 'default';
    }
  };

  const getStatusLabel = (statusValue: string) => {
    switch (statusValue) {
      case 'pending':
        return 'Pending';
      case 'pickup':
        return 'Pickup';
      case 'delivered':
        return 'Delivered';
      default:
        return statusValue;
    }
  };

  const getPaymentColor = (paymentStatus: string) => {
    switch (paymentStatus) {
      case 'paid':
        return 'success';
      case 'pending':
        return 'warning';
      case 'failed':
        return 'error';
      default:
        return 'default';
    }
  };

  const getPaymentLabel = (paymentStatus: string) => {
    switch (paymentStatus) {
      case 'paid':
        return 'Paid';
      case 'pending':
        return 'Pending';
      case 'failed':
        return 'Failed';
      default:
        return paymentStatus;
    }
  };

  return (
    <TableRow 
      hover 
      selected={selected}
      sx={{
        '&:last-child .MuiTableCell-root': {
          borderBottom: 'none',
        },
        '& .MuiTableCell-root': {
          py: 2.5,
          px: 3,
        },
      }}
    >
      <TableCell padding="checkbox">
        <Checkbox 
          checked={selected} 
          onClick={onSelectRow}
          sx={{
            '&.Mui-checked': {
              color: 'primary.main',
            },
          }}
        />
      </TableCell>

      <TableCell>
        <Typography 
          variant="subtitle2" 
          sx={{ 
            fontWeight: 700,
            color: 'primary.main',
            fontSize: '0.875rem',
          }}
        >
          {row.orderNumber}
        </Typography>
      </TableCell>

      <TableCell>
        <Stack spacing={0.5}>
          <Typography 
            variant="subtitle2" 
            sx={{ 
              fontWeight: 600,
              fontSize: '0.875rem',
            }}
          >
            {row.customerName}
          </Typography>
          <Typography 
            variant="caption" 
            sx={{ 
              color: 'text.secondary',
              fontSize: '0.75rem',
            }}
          >
            {row.customerEmail}
          </Typography>
        </Stack>
      </TableCell>

      <TableCell>
        <Stack spacing={1}>
          {row.items.map((item, index) => (
            <Box 
              key={item.id} 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1.5,
                p: 1,
                borderRadius: 1,
                backgroundColor: index % 2 === 0 ? 'transparent' : alpha(theme.palette.primary.main, 0.04),
              }}
            >
              <Box
                component="img"
                src={item.image}
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: 1.5,
                  objectFit: 'cover',
                  border: '1px solid',
                  borderColor: 'divider',
                }}
              />
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography 
                  variant="caption" 
                  sx={{ 
                    fontWeight: 600, 
                    display: 'block',
                    fontSize: '0.75rem',
                    color: 'text.primary',
                  }}
                >
                  {item.name}
                </Typography>
                <Typography 
                  variant="caption" 
                  sx={{ 
                    color: 'text.secondary',
                    fontSize: '0.7rem',
                  }}
                >
                  Qty: {item.quantity}
                </Typography>
              </Box>
            </Box>
          ))}
        </Stack>
      </TableCell>

      <TableCell align="right">
        <Typography 
          variant="subtitle2" 
          sx={{ 
            fontWeight: 700,
            fontSize: '0.875rem',
            color: 'success.main',
          }}
        >
          ${row.total.toFixed(2)}
        </Typography>
      </TableCell>

      <TableCell align="center">
        <Label
          variant="soft"
          color={getStatusColor(status)}
          sx={{
            textTransform: 'capitalize',
            fontWeight: 600,
            cursor: 'pointer',
            fontSize: '0.75rem',
            px: 1.5,
            py: 0.5,
            borderRadius: 1.5,
            transition: 'all 0.2s ease',
            '&:hover': {
              opacity: 0.8,
              transform: 'scale(1.05)',
            },
          }}
          onClick={() => {
            const statuses = ['pending', 'pickup', 'delivered'];
            const currentIndex = statuses.indexOf(status);
            const nextIndex = (currentIndex + 1) % statuses.length;
            handleStatusChange(statuses[nextIndex]);
          }}
        >
          {getStatusLabel(status)}
        </Label>
      </TableCell>

      <TableCell>
        <Typography 
          variant="caption" 
          sx={{ 
            color: 'text.secondary',
            fontSize: '0.75rem',
            fontWeight: 500,
          }}
        >
          {new Date(row.orderDate).toLocaleDateString()}
        </Typography>
      </TableCell>

      <TableCell align="center">
        <Label
          variant="soft"
          color={getPaymentColor(row.paymentStatus)}
          sx={{
            textTransform: 'capitalize',
            fontWeight: 600,
            fontSize: '0.75rem',
            px: 1.5,
            py: 0.5,
            borderRadius: 1.5,
          }}
        >
          {getPaymentLabel(row.paymentStatus)}
        </Label>
      </TableCell>

      <TableCell align="center">
        <IconButton
          color="primary"
          onClick={handleViewDetails}
          sx={{
            backgroundColor: alpha(theme.palette.primary.main, 0.08),
            borderRadius: 2,
            width: 36,
            height: 36,
            transition: 'all 0.2s ease',
            '&:hover': {
              backgroundColor: alpha(theme.palette.primary.main, 0.16),
              transform: 'scale(1.1)',
            },
          }}
        >
          <LucideIcon icon="eva:eye-fill" sx={{ fontSize: 18 }} />
        </IconButton>
      </TableCell>
    </TableRow>
  );
}
