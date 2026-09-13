import { useRef, useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { useRouter } from 'src/routes/hooks';

import { DashboardContent } from 'src/layouts/dashboard';

import { Breadcrumb } from 'src/components/breadcrumb';
import { LucideIcon } from 'src/components/lucide-icons';

// ----------------------------------------------------------------------

export function NewBlogView() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
  });

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');

  const handleInputChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string);
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
    router.push('/dashboard/blog');
  }, [formData, selectedImage, router]);

  return (
    <DashboardContent>
      <Breadcrumb 
        title="New Blog Post" 
        items={[
          { title: 'Dashboard', href: '/dashboard' },
          { title: 'Blog', href: '/dashboard/blog' },
          { title: 'New Post' }
        ]} 
      />

      <Box sx={{ display: 'flex', justifyContent: 'flex-start', mt: 3, mb: 2 }}>
        <Button
          variant="outlined"
          size="large"
          onClick={() => router.push('/dashboard/blog')}
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
            Blog Information
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField
              fullWidth
              name="title"
              label="Blog Title"
              value={formData.title}
              onChange={handleInputChange('title')}
              slotProps={{
                inputLabel: { shrink: true },
              }}
            />

            <TextField
              fullWidth
              name="description"
              label="Description"
              multiline
              rows={4}
              value={formData.description}
              onChange={handleInputChange('description')}
              slotProps={{
                inputLabel: { shrink: true },
              }}
            />

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Blog Image
              </Typography>
              
              <Box
                onClick={handleImageClick}
                sx={{
                  width: '100%',
                  height: 200,
                  border: '2px dashed',
                  borderColor: 'grey.300',
                  borderRadius: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  position: 'relative',
                  overflow: 'hidden',
                  '&:hover': {
                    borderColor: 'grey.400',
                    backgroundColor: 'grey.50',
                  },
                }}
              >
                {previewUrl ? (
                  <Box
                    component="img"
                    src={previewUrl}
                    alt="Preview"
                    sx={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                ) : (
                  <Box sx={{ textAlign: 'center' }}>
                    <LucideIcon icon="eva:cloud-upload-fill" sx={{ fontSize: 48, color: 'grey.400', mb: 1 }} />
                    <Typography variant="body2" color="text.secondary">
                      Click to upload image
                    </Typography>
                    <Typography variant="caption" color="text.disabled">
                      JPG, PNG, GIF up to 10MB
                    </Typography>
                  </Box>
                )}
              </Box>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                style={{ display: 'none' }}
              />
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
