import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';

import { useRouter } from 'src/routes/hooks';

import { DashboardContent } from 'src/layouts/dashboard';

import { useSnackbar } from 'src/components/snackbar';
import { Breadcrumb } from 'src/components/breadcrumb';
import { LucideIcon } from 'src/components/lucide-icons';

// ----------------------------------------------------------------------

const CATEGORIES = [
  'Electronics',
  'Clothing',
  'Home & Garden',
  'Sports',
  'Books',
  'Automotive',
];

const STATUS_OPTIONS = [
  'In Stock',
  'Low Stock',
  'Out of Stock',
  'Discontinued',
];

export function NewInventoryView() {
  const router = useRouter();
  const { showSnackbar } = useSnackbar();

  const [formData, setFormData] = useState({
    sku: '',
    name: '',
    category: '',
    quantity: '',
    minQuantity: '',
    maxQuantity: '',
    unitPrice: '',
    supplier: '',
    location: '',
    status: 'In Stock',
  });

  const handleInputChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const handleSelectChange = (field: string) => (event: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const handleSubmit = useCallback(() => {
    // Handle form submission here
    console.log('Form data:', formData);
    
    // Basic validation
    if (!formData.sku || !formData.name || !formData.category || !formData.quantity) {
      showSnackbar('Please fill in all required fields', 'error');
      return;
    }
    
    // Simulate API call
    try {
      // Here you would make an API call to create the inventory item
      setTimeout(() => {
        router.push('/dashboard/inventory?refresh=true&action=created');
      }, 1500);
    } catch (error) {
      showSnackbar('Failed to create inventory item. Please try again.', 'error');
    }
  }, [formData, router, showSnackbar]);

  return (
    <DashboardContent>
      <Breadcrumb 
        title="New Inventory Item" 
        items={[
          { title: 'Dashboard', href: '/dashboard' },
          { title: 'Inventory', href: '/dashboard/inventory' },
          { title: 'New Item' }
        ]} 
      />

      <Box sx={{ display: 'flex', justifyContent: 'flex-start', mt: 3, mb: 2 }}>
        <Button
          variant="outlined"
          size="large"
          onClick={() => router.push('/dashboard/inventory')}
          startIcon={<LucideIcon icon="eva:arrow-back-fill" />}
          sx={{
            borderColor: 'grey.400',
            color: 'grey.700',
            '&:hover': {
              borderColor: 'grey.600',
              backgroundColor: 'grey.50',
            },
          }}
        >
          Back
        </Button>
      </Box>

      <Box sx={{ display: 'flex', gap: 3 }}>
        <Card sx={{ 
          flex: 1, 
          p: 3, 
          border: '1px solid #E0E0E0',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
          backgroundColor: '#FFFFFF'
        }}>
          <Typography variant="h6" sx={{ mb: 3 }}>
            Inventory Item Information
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                fullWidth
                name="sku"
                label="SKU"
                value={formData.sku}
                onChange={handleInputChange('sku')}
                slotProps={{
                  inputLabel: { shrink: true },
                }}
              />
              <TextField
                fullWidth
                name="name"
                label="Item Name"
                value={formData.name}
                onChange={handleInputChange('name')}
                slotProps={{
                  inputLabel: { shrink: true },
                }}
              />
            </Box>

            <Box sx={{ display: 'flex', gap: 2 }}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={formData.category}
                  label="Category"
                  onChange={handleSelectChange('category')}
                >
                  {CATEGORIES.map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                fullWidth
                name="supplier"
                label="Supplier"
                value={formData.supplier}
                onChange={handleInputChange('supplier')}
                slotProps={{
                  inputLabel: { shrink: true },
                }}
              />
            </Box>

            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                fullWidth
                name="quantity"
                label="Quantity"
                type="number"
                value={formData.quantity}
                onChange={handleInputChange('quantity')}
                slotProps={{
                  inputLabel: { shrink: true },
                }}
              />
              <TextField
                fullWidth
                name="unitPrice"
                label="Unit Price"
                type="number"
                value={formData.unitPrice}
                onChange={handleInputChange('unitPrice')}
                slotProps={{
                  inputLabel: { shrink: true },
                }}
              />
            </Box>

            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                fullWidth
                name="minQuantity"
                label="Minimum Quantity"
                type="number"
                value={formData.minQuantity}
                onChange={handleInputChange('minQuantity')}
                slotProps={{
                  inputLabel: { shrink: true },
                }}
              />
              <TextField
                fullWidth
                name="maxQuantity"
                label="Maximum Quantity"
                type="number"
                value={formData.maxQuantity}
                onChange={handleInputChange('maxQuantity')}
                slotProps={{
                  inputLabel: { shrink: true },
                }}
              />
            </Box>

            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                fullWidth
                name="location"
                label="Location"
                value={formData.location}
                onChange={handleInputChange('location')}
                slotProps={{
                  inputLabel: { shrink: true },
                }}
              />
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={formData.status}
                  label="Status"
                  onChange={handleSelectChange('status')}
                >
                  {STATUS_OPTIONS.map((status) => (
                    <MenuItem key={status} value={status}>
                      {status}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
              <Button
                variant="contained"
                size="large"
                onClick={handleSubmit}
              >
                Save Changes
              </Button>
            </Box>
          </Box>
        </Card>
      </Box>
    </DashboardContent>
  );
}
