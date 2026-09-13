import { useState, useCallback, useRef } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';

import { useRouter } from 'src/routes/hooks';

import { DashboardContent } from 'src/layouts/dashboard';

import { useSnackbar } from 'src/components/snackbar';
import { Breadcrumb } from 'src/components/breadcrumb';
import { LucideIcon } from 'src/components/lucide-icons';

// ----------------------------------------------------------------------

export function NewCategoryView() {
  const router = useRouter();
  const { showSnackbar } = useSnackbar();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'active',
  });

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  const handleInputChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = useCallback(() => {
    // Handle form submission here
    console.log('Form data:', formData);
    console.log('Selected image:', selectedImage);
    
    // Basic validation
    if (!formData.name || !formData.description) {
      showSnackbar('Please fill in all required fields', 'error');
      return;
    }
    
    if (!selectedImage) {
      showSnackbar('Please select an image', 'error');
      return;
    }
    
    // Simulate API call
    try {
      // Here you would make an API call to create the category
      setTimeout(() => {
        router.push('/dashboard/categories?refresh=true&action=created');
      }, 1500);
    } catch (error) {
      showSnackbar('Failed to create category. Please try again.', 'error');
    }
  }, [formData, selectedImage, router, showSnackbar]);

  return (
    <DashboardContent>
      <Breadcrumb 
        title="New Category" 
        items={[
          { title: 'Dashboard', href: '/dashboard' },
          { title: 'Categories', href: '/dashboard/categories' },
          { title: 'New Category' }
        ]} 
      />

      <Box sx={{ display: 'flex', justifyContent: 'flex-start', mt: 3, mb: 2 }}>
        <Button
          variant="outlined"
          size="large"
          onClick={() => router.push('/dashboard/categories')}
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
            Category Information
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                fullWidth
                name="name"
                label="Category Name"
                value={formData.name}
                onChange={handleInputChange('name')}
                slotProps={{
                  inputLabel: { shrink: true },
                }}
              />
            </Box>

            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                fullWidth
                name="description"
                label="Description"
                multiline
                rows={3}
                value={formData.description}
                onChange={handleInputChange('description')}
                slotProps={{
                  inputLabel: { shrink: true },
                }}
              />
            </Box>

            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                fullWidth
                name="status"
                label="Status"
                value={formData.status}
                onChange={handleInputChange('status')}
                slotProps={{
                  inputLabel: { shrink: true },
                }}
              />
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Typography variant="subtitle1">Category Image</Typography>
              
              <Box
                onClick={handleImageClick}
                sx={{
                  width: 200,
                  height: 200,
                  border: '2px dashed #ccc',
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  backgroundImage: imagePreview ? `url(${imagePreview})` : 'none',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                  '&:hover': {
                    borderColor: '#000',
                    backgroundColor: imagePreview ? 'transparent' : '#f5f5f5',
                  },
                }}
              >
                {!imagePreview && (
                  <Box sx={{ textAlign: 'center' }}>
                    <LucideIcon icon="eva:image-fill" sx={{ fontSize: 48, color: '#ccc', mb: 1 }} />
                    <Typography variant="body2" color="text.secondary">
                      Click to upload image
                    </Typography>
                  </Box>
                )}
              </Box>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                style={{ display: 'none' }}
              />

              {selectedImage && (
                <Typography variant="body2" color="text.secondary">
                  Selected: {selectedImage.name}
                </Typography>
              )}
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
              <Button
                variant="contained"
                size="large"
                onClick={handleSubmit}
              >
                Create Category
              </Button>
            </Box>
          </Box>
        </Card>
      </Box>
    </DashboardContent>
  );
}
