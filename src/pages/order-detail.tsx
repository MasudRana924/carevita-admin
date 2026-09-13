import { useParams } from 'react-router-dom';
import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';

import { useRouter } from 'src/routes/hooks';

import { _orders } from 'src/_mock';
import { DashboardContent } from 'src/layouts/dashboard';

import { Label } from 'src/components/label';
import { Breadcrumb } from 'src/components/breadcrumb';
import { LucideIcon } from 'src/components/lucide-icons';

// ----------------------------------------------------------------------

export default function OrderDetailPage() {
  const router = useRouter();
  const { id } = useParams();
  
  const orderData = _orders.find((orderItem) => orderItem.id === id);
  
  const [status, setStatus] = useState(orderData?.status || 'pending');
  const [notes, setNotes] = useState(orderData?.notes || '');

  const handleStatusChange = useCallback((event: any) => {
    setStatus(event.target.value);
    // Here you would typically make an API call to update the order status
    console.log(`Order ${orderData?.orderNumber} status changed to ${event.target.value}`);
  }, [orderData?.orderNumber]);

  const handleNotesChange = useCallback((event: any) => {
    setNotes(event.target.value);
    // Here you would typically make an API call to update the order notes
    console.log(`Order ${orderData?.orderNumber} notes updated`);
  }, [orderData?.orderNumber]);

  const handleSaveChanges = useCallback(() => {
    // Here you would typically make an API call to save all changes
    console.log('Saving changes for order:', orderData?.orderNumber);
    // You can add a success notification here
  }, [orderData?.orderNumber]);

  const handleBack = useCallback(() => {
    router.push('/dashboard/orders');
  }, [router]);

  if (!orderData) {
    return (
      <DashboardContent>
        <Typography variant="h6">Order not found</Typography>
      </DashboardContent>
    );
  }

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
    <DashboardContent>
      <Breadcrumb 
        title={`Order ${orderData.orderNumber}`}
        items={[
          { title: 'Dashboard', href: '/dashboard' },
          { title: 'Orders', href: '/dashboard/orders' },
          { title: orderData.orderNumber }
        ]} 
      />

      <Box sx={{ mb: 3 }}>
        <Button
          variant="outlined"
          startIcon={<LucideIcon icon="eva:arrow-back-fill" />}
          onClick={handleBack}
          sx={{
            border: '1px solid',
            borderColor: 'divider',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            backgroundColor: '#FFFFFF',
            '&:hover': {
              backgroundColor: '#f5f5f5',
            },
          }}
        >
          Back
        </Button>
      </Box>

      <Card
        sx={{
          p: 4,
          border: '1px solid',
          borderColor: 'divider',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          backgroundColor: '#FFFFFF',
          borderRadius: 3,
        }}
      >
        {/* Order Header */}
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
          <Box>
            <Typography variant="h4" sx={{ mb: 1, fontWeight: 700, color: 'text.primary' }}>
              {orderData.orderNumber}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '1rem' }}>
              Placed on {new Date(orderData.orderDate).toLocaleDateString()}
            </Typography>
          </Box>
          <Stack direction="row" spacing={2} alignItems="center">
            <Label
              variant="soft"
              color={getStatusColor(status)}
              sx={{
                textTransform: 'capitalize',
                fontWeight: 600,
                fontSize: '0.875rem',
                px: 3,
                py: 1,
                borderRadius: 2,
              }}
            >
              {getStatusLabel(status)}
            </Label>
            <Label
              variant="soft"
              color={getPaymentColor(orderData.paymentStatus)}
              sx={{
                textTransform: 'capitalize',
                fontWeight: 600,
                fontSize: '0.875rem',
                px: 3,
                py: 1,
                borderRadius: 2,
              }}
            >
              {getPaymentLabel(orderData.paymentStatus)}
            </Label>
          </Stack>
        </Stack>

        <Divider sx={{ mb: 4 }} />

        {/* Customer Information */}
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 600, color: 'text.primary' }}>
          Customer Information
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3, mb: 4 }}>
          <Box sx={{ flex: 1 }}>
            <TextField
              fullWidth
              label="Customer Name"
              value={orderData.customerName}
              InputProps={{ readOnly: true }}
              sx={{ 
                mb: 3,
                '& .MuiOutlinedInput-root': {
                  backgroundColor: '#f8fafc',
                  '& fieldset': {
                    borderColor: 'divider',
                  },
                },
              }}
            />
            <TextField
              fullWidth
              label="Email"
              value={orderData.customerEmail}
              InputProps={{ readOnly: true }}
              sx={{ 
                mb: 3,
                '& .MuiOutlinedInput-root': {
                  backgroundColor: '#f8fafc',
                  '& fieldset': {
                    borderColor: 'divider',
                  },
                },
              }}
            />
            <TextField
              fullWidth
              label="Phone"
              value={orderData.customerPhone}
              InputProps={{ readOnly: true }}
              sx={{ 
                mb: 3,
                '& .MuiOutlinedInput-root': {
                  backgroundColor: '#f8fafc',
                  '& fieldset': {
                    borderColor: 'divider',
                  },
                },
              }}
            />
            <TextField
              fullWidth
              label="Address"
              value={orderData.customerAddress}
              InputProps={{ readOnly: true }}
              multiline
              rows={4}
              sx={{ 
                '& .MuiOutlinedInput-root': {
                  backgroundColor: '#f8fafc',
                  '& fieldset': {
                    borderColor: 'divider',
                  },
                },
              }}
            />
          </Box>
        </Box>

        <Divider sx={{ mb: 4 }} />

        {/* Order Items */}
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 600, color: 'text.primary' }}>
          Order Items
        </Typography>
        <Box sx={{ mb: 4 }}>
          {orderData.items.map((item, index) => (
            <Paper
              key={item.id}
              elevation={0}
              sx={{
                p: 3,
                mb: 2,
                border: '1px solid',
                borderColor: 'divider',
                backgroundColor: '#fafafa',
                borderRadius: 2,
                '&:hover': {
                  backgroundColor: '#f5f5f5',
                  transition: 'background-color 0.2s ease',
                },
              }}
            >
              <Stack direction="row" spacing={3} alignItems="center">
                <Box
                  component="img"
                  src={item.image}
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: 2,
                    objectFit: 'cover',
                    border: '1px solid',
                    borderColor: 'divider',
                  }}
                />
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                    {item.name}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                    Quantity: {item.quantity}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Price per item: ${item.price.toFixed(2)}
                  </Typography>
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>
                  ${(item.price * item.quantity).toFixed(2)}
                </Typography>
              </Stack>
            </Paper>
          ))}
        </Box>

        {/* Order Summary */}
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 600, color: 'text.primary' }}>
          Order Summary
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3, mb: 4 }}>
          <Box sx={{ flex: 1 }}>
            <Card
              sx={{
                p: 3,
                border: '1px solid',
                borderColor: 'divider',
                backgroundColor: '#FFFFFF',
                borderRadius: 2,
                height: '100%',
              }}
            >
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: 'text.primary' }}>
                Order Details
              </Typography>
              <Stack spacing={2}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body1">Subtotal:</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    ${orderData.subtotal.toFixed(2)}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body1">Shipping:</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    ${orderData.shipping.toFixed(2)}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body1">Tax:</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    ${orderData.tax.toFixed(2)}
                  </Typography>
                </Box>
                <Divider sx={{ my: 1 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary' }}>
                    Total:
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>
                    ${orderData.total.toFixed(2)}
                  </Typography>
                </Box>
              </Stack>
            </Card>
          </Box>
          <Box sx={{ flex: 1 }}>
            <Card
              sx={{
                p: 3,
                border: '1px solid',
                borderColor: 'divider',
                backgroundColor: '#FFFFFF',
                borderRadius: 2,
                height: '100%',
              }}
            >
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: 'text.primary' }}>
                Payment & Delivery
              </Typography>
              <Stack spacing={2}>
                <Box>
                  <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>
                    Payment Method
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {orderData.paymentMethod}
                  </Typography>
                </Box>
                {orderData.trackingNumber && (
                  <Box>
                    <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>
                      Tracking Number
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {orderData.trackingNumber}
                    </Typography>
                  </Box>
                )}
                <Box>
                  <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>
                    Estimated Delivery
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {orderData.estimatedDelivery}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>
                    Order Date
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {new Date(orderData.orderDate).toLocaleDateString()}
                  </Typography>
                </Box>
              </Stack>
            </Card>
          </Box>
        </Box>

        <Divider sx={{ mb: 4 }} />

        {/* Order Management */}
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 600, color: 'text.primary' }}>
          Order Management
        </Typography>
        <Stack spacing={3} sx={{ mb: 4 }}>
          <FormControl fullWidth>
            <InputLabel>Status</InputLabel>
            <Select
              value={status}
              label="Status"
              onChange={handleStatusChange}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: '#f8fafc',
                  '& fieldset': {
                    borderColor: 'divider',
                  },
                },
              }}
            >
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="pickup">Pickup</MenuItem>
              <MenuItem value="delivered">Delivered</MenuItem>
            </Select>
          </FormControl>
          <TextField
            fullWidth
            label="Notes"
            value={notes}
            onChange={handleNotesChange}
            multiline
            rows={3}
            placeholder="Add order notes..."
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: '#f8fafc',
                '& fieldset': {
                  borderColor: 'divider',
                },
              },
            }}
          />
        </Stack>

        {/* Save Changes Button */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSaveChanges}
            sx={{
              px: 4,
              py: 1.5,
              fontWeight: 600,
              borderRadius: 2,
              textTransform: 'none',
              fontSize: '1rem',
            }}
          >
            Save Changes
          </Button>
        </Box>
      </Card>
    </DashboardContent>
  );
}
