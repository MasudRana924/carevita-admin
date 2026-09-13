import { useRef, useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import FormHelperText from '@mui/material/FormHelperText';

import { DashboardContent } from 'src/layouts/dashboard';

import { LucideIcon } from 'src/components/lucide-icons';

import { foodFormValidationSchema, type FoodFormData } from './validation-schema';

// ----------------------------------------------------------------------

const CATEGORIES = [
  'breakfast',
  'lunch', 
  'dinner',
  'snacks',
  'desserts',
  'beverages'
];



interface FoodFormProps {
  initialData?: Partial<FoodFormData>;
  onSubmit: (data: FoodFormData, imageFile?: File) => void;
  isLoading?: boolean;
  submitButtonText?: string;
}

export function FoodForm({ 
  initialData = {}, 
  onSubmit, 
  isLoading = false,
  submitButtonText = 'Create Food'
}: FoodFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<FoodFormData>({
    name: initialData.name || '',
    description: initialData.description || '',
    price: initialData.price || '',
    category: initialData.category || '',
    image: initialData.image || '',
    preparationTime: initialData.preparationTime || '',
    available: initialData.available ?? true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>(initialData.image || '');

  const handleInputChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    let value = event.target.value;
    
    // Special handling for price field
    if (field === 'price') {
      // Remove any non-numeric characters except decimal point
      value = value.replace(/[^0-9.]/g, '');
      // Ensure only one decimal point
      const parts = value.split('.');
      if (parts.length > 2) {
        value = parts[0] + '.' + parts.slice(1).join('');
      }
      // Limit decimal places to 2
      if (parts.length === 2 && parts[1].length > 2) {
        value = parts[0] + '.' + parts[1].substring(0, 2);
      }
    }
    
    // Special handling for name field
    if (field === 'name') {
      // Remove leading whitespace
      value = value.replace(/^\s+/, '');
      // Remove special characters from the start
      value = value.replace(/^[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/, '');
    }
    
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  const handleSelectChange = (field: string) => (event: any) => {
    const value = event.target.value;
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    
    // Clear error when user selects an option
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  const handleSwitchChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.checked,
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

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setPreviewUrl('');
    setFormData(prev => ({ ...prev, image: '' }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = useCallback(async () => {
    try {
      // Validate form data using Yup schema
      const validatedData = await foodFormValidationSchema.validate(formData, {
        abortEarly: false,
      });

      const submitData = {
        ...validatedData,
        price: validatedData.price,
        preparationTime: validatedData.preparationTime || '0',
      };

      onSubmit(submitData, selectedImage || undefined);
    } catch (validationError: any) {
      if (validationError.inner) {
        const newErrors: Record<string, string> = {};
        validationError.inner.forEach((error: any) => {
          newErrors[error.path] = error.message;
        });
        setErrors(newErrors);
      }
    }
  }, [formData, selectedImage, onSubmit]);

  return (
    <DashboardContent>
      <Card sx={{ p: 3, border: '1px solid #E0E0E0' }}>
        {/* Image Upload Section */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" sx={{ mb: 2, color: 'text.primary' }}>
            Food Image
          </Typography>
          
          <Box
            sx={{
              position: 'relative',
              width: '100%',
              height: 300,
              borderRadius: 2,
              border: '2px dashed',
              borderColor: previewUrl ? 'transparent' : 'grey.300',
              backgroundColor: previewUrl ? 'transparent' : 'grey.50',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              '&:hover': {
                borderColor: 'primary.main',
                backgroundColor: 'grey.100',
              },
            }}
            onClick={handleImageClick}
          >
            {previewUrl ? (
              <>
                <Box
                  component="img"
                  src={previewUrl}
                  alt="Food preview"
                  sx={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    borderRadius: 1,
                  }}
                />
                <Box
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    display: 'flex',
                    gap: 1,
                  }}
                >
                  <Button
                    size="small"
                    variant="contained"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleImageClick();
                    }}
                    sx={{
                      minWidth: 'auto',
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      backgroundColor: 'rgba(0, 0, 0, 0.7)',
                      '&:hover': {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                      },
                    }}
                  >
                    <LucideIcon icon="eva:edit-fill" sx={{ fontSize: 16 }} />
                  </Button>
                  <Button
                    size="small"
                    variant="contained"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveImage();
                    }}
                    sx={{
                      minWidth: 'auto',
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      backgroundColor: 'rgba(255, 0, 0, 0.7)',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 0, 0, 0.8)',
                      },
                    }}
                  >
                    <LucideIcon icon="eva:trash-2-fill" sx={{ fontSize: 16 }} />
                  </Button>
                </Box>
              </>
            ) : (
              <Stack spacing={2} alignItems="center">
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    backgroundColor: 'primary.main',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                  }}
                >
                  <LucideIcon icon="eva:camera-fill" sx={{ fontSize: 32 }} />
                </Box>
                <Typography variant="body1" color="text.secondary">
                  Click to upload food image
                </Typography>
                <Typography variant="body2" color="text.disabled">
                  PNG, JPG up to 10MB
                </Typography>
              </Stack>
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

        {/* Form Fields */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
            <Box sx={{ flex: 1 }}>
              <TextField
                fullWidth
                label="Food Name"
                value={formData.name}
                onChange={handleInputChange('name')}
                required
                error={!!errors.name}
                helperText={errors.name}
              />
            </Box>

            <Box sx={{ flex: 1 }}>
              <FormControl fullWidth required error={!!errors.category}>
                <InputLabel>Category</InputLabel>
                <Select
                  value={formData.category}
                  label="Category"
                  onChange={handleSelectChange('category')}
                >
                  {CATEGORIES.map((category) => (
                    <MenuItem key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </MenuItem>
                  ))}
                </Select>
                {errors.category && (
                  <FormHelperText>{errors.category}</FormHelperText>
                )}
              </FormControl>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
            <Box sx={{ flex: 1 }}>
              <TextField
                fullWidth
                label="Price"
                type="number"
                value={formData.price}
                onChange={handleInputChange('price')}
                required
                error={!!errors.price}
                helperText={errors.price}
                InputProps={{
                  startAdornment: <Typography sx={{ mr: 1 }}>$</Typography>,
                }}
              />
            </Box>

            <Box sx={{ flex: 1 }}>
              <TextField
                fullWidth
                label="Preparation Time (minutes)"
                type="number"
                value={formData.preparationTime}
                onChange={handleInputChange('preparationTime')}
                error={!!errors.preparationTime}
                helperText={errors.preparationTime}
              />
            </Box>
          </Box>

          <Box>
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Description"
              value={formData.description}
              onChange={handleInputChange('description')}
              placeholder="Describe the food item, ingredients, and any special notes..."
              error={!!errors.description}
              helperText={errors.description}
            />
          </Box>

          <Box>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.available}
                  onChange={handleSwitchChange('available')}
                />
              }
              label="Available for ordering"
            />
          </Box>
        </Box>

        {/* Submit Button */}
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            size="large"
            onClick={handleSubmit}
            disabled={isLoading}
            startIcon={<LucideIcon icon="eva:checkmark-circle-2-fill" />}
            sx={{
              px: 4,
              py: 1.5,
              borderRadius: 2,
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
              '&:hover': {
                boxShadow: '0 6px 16px rgba(0, 0, 0, 0.2)',
              },
            }}
          >
            {isLoading ? 'Saving...' : submitButtonText}
          </Button>
        </Box>
      </Card>
    </DashboardContent>
  );
}

