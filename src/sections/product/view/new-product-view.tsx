import { useRef, useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';

import { useRouter } from 'src/routes/hooks';

import { DashboardContent } from 'src/layouts/dashboard';

import { Breadcrumb } from 'src/components/breadcrumb';
import { LucideIcon } from 'src/components/lucide-icons';

// ----------------------------------------------------------------------

const CATEGORIES = [
  'Electronics',
  'Clothing',
  'Books',
  'Home & Garden',
  'Sports',
  'Beauty',
  'Toys',
  'Automotive',
];

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const COLORS = ['Red', 'Blue', 'Green', 'Yellow', 'Black', 'White', 'Pink', 'Purple'];

export function NewProductView() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    salePrice: '',
    category: '',
    sku: '',
    stock: '',
    weight: '',
    dimensions: '',
  });

  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [isOnSale, setIsOnSale] = useState(false);
  const [isAvailable, setIsAvailable] = useState(true);

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

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length > 0) {
      setSelectedImages(prev => [...prev, ...files]);
      
      files.forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
          setPreviewUrls(prev => [...prev, e.target?.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  const handleSizeToggle = (size: string) => {
    setSelectedSizes(prev => 
      prev.includes(size) 
        ? prev.filter(s => s !== size)
        : [...prev, size]
    );
  };

  const handleColorToggle = (color: string) => {
    setSelectedColors(prev => 
      prev.includes(color) 
        ? prev.filter(c => c !== color)
        : [...prev, color]
    );
  };

  const handleSubmit = useCallback(() => {
    // Handle form submission here
    console.log('Form data:', formData);
    console.log('Selected images:', selectedImages);
    console.log('Selected sizes:', selectedSizes);
    console.log('Selected colors:', selectedColors);
    console.log('On sale:', isOnSale);
    console.log('Available:', isAvailable);
    router.push('/dashboard/products');
  }, [formData, selectedImages, selectedSizes, selectedColors, isOnSale, isAvailable, router]);

  return (
    <DashboardContent>
      <Breadcrumb 
        title="New Product" 
        items={[
          { title: 'Dashboard', href: '/dashboard' },
          { title: 'Products', href: '/dashboard/products' },
          { title: 'New Product' }
        ]} 
      />

      <Box sx={{ display: 'flex', justifyContent: 'flex-start', mt: 3, mb: 2 }}>
        <Button
          variant="outlined"
          size="large"
          onClick={() => router.push('/dashboard/products')}
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
            Product Information
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Basic Information */}
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2 }}>
              <Box sx={{ flex: { md: 8 } }}>
                <TextField
                  fullWidth
                  name="name"
                  label="Product Name"
                  value={formData.name}
                  onChange={handleInputChange('name')}
                  slotProps={{
                    inputLabel: { shrink: true },
                  }}
                />
              </Box>
              <Box sx={{ flex: { md: 4 } }}>
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
              </Box>
            </Box>

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

            {/* Pricing */}
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2 }}>
              <Box sx={{ flex: { md: 3 } }}>
                <TextField
                  fullWidth
                  name="price"
                  label="Regular Price"
                  type="number"
                  value={formData.price}
                  onChange={handleInputChange('price')}
                  slotProps={{
                    inputLabel: { shrink: true },
                  }}
                />
              </Box>
              <Box sx={{ flex: { md: 3 } }}>
                <TextField
                  fullWidth
                  name="salePrice"
                  label="Sale Price"
                  type="number"
                  value={formData.salePrice}
                  onChange={handleInputChange('salePrice')}
                  disabled={!isOnSale}
                  slotProps={{
                    inputLabel: { shrink: true },
                  }}
                />
              </Box>
              <Box sx={{ flex: { md: 6 } }}>
                <FormControl fullWidth sx={{ minWidth: 200 }}>
                  <InputLabel id="category-label">Category</InputLabel>
                  <Select
                    labelId="category-label"
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
              </Box>
            </Box>

            {/* Inventory */}
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2 }}>
              <Box sx={{ flex: { md: 4 } }}>
                <TextField
                  fullWidth
                  name="stock"
                  label="Stock Quantity"
                  type="number"
                  value={formData.stock}
                  onChange={handleInputChange('stock')}
                  slotProps={{
                    inputLabel: { shrink: true },
                  }}
                />
              </Box>
              <Box sx={{ flex: { md: 4 } }}>
                <TextField
                  fullWidth
                  name="weight"
                  label="Weight (kg)"
                  type="number"
                  value={formData.weight}
                  onChange={handleInputChange('weight')}
                  slotProps={{
                    inputLabel: { shrink: true },
                  }}
                />
              </Box>
              <Box sx={{ flex: { md: 4 } }}>
                <TextField
                  fullWidth
                  name="dimensions"
                  label="Dimensions (LxWxH cm)"
                  value={formData.dimensions}
                  onChange={handleInputChange('dimensions')}
                  slotProps={{
                    inputLabel: { shrink: true },
                  }}
                />
              </Box>
            </Box>

            {/* Options */}
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2 }}>
              <Box sx={{ flex: { md: 6 } }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={isOnSale}
                      onChange={(e) => setIsOnSale(e.target.checked)}
                    />
                  }
                  label="On Sale"
                />
              </Box>
              <Box sx={{ flex: { md: 6 } }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={isAvailable}
                      onChange={(e) => setIsAvailable(e.target.checked)}
                    />
                  }
                  label="Available for Purchase"
                />
              </Box>
            </Box>

            {/* Sizes */}
            <Box>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                Available Sizes
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {SIZES.map((size) => (
                  <Chip
                    key={size}
                    label={size}
                    onClick={() => handleSizeToggle(size)}
                    color={selectedSizes.includes(size) ? 'primary' : 'default'}
                    variant={selectedSizes.includes(size) ? 'filled' : 'outlined'}
                    clickable
                  />
                ))}
              </Box>
            </Box>

            {/* Colors */}
            <Box>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                Available Colors
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {COLORS.map((color) => (
                  <Chip
                    key={color}
                    label={color}
                    onClick={() => handleColorToggle(color)}
                    color={selectedColors.includes(color) ? 'primary' : 'default'}
                    variant={selectedColors.includes(color) ? 'filled' : 'outlined'}
                    clickable
                  />
                ))}
              </Box>
            </Box>

            {/* Image Upload */}
            <Box>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>
                Product Images
              </Typography>
              
              <Box
                onClick={handleImageClick}
                sx={{
                  width: '100%',
                  minHeight: 200,
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
                {previewUrls.length > 0 ? (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, p: 2 }}>
                    {previewUrls.map((url, index) => (
                      <Box key={index} sx={{ width: { xs: 'calc(50% - 4px)', sm: 'calc(33.333% - 4px)', md: 'calc(25% - 4px)' } }}>
                        <Box sx={{ position: 'relative' }}>
                          <Box
                            component="img"
                            src={url}
                            alt={`Preview ${index + 1}`}
                            sx={{
                              width: '100%',
                              height: 120,
                              objectFit: 'cover',
                              borderRadius: 1,
                            }}
                          />
                          <Button
                            size="small"
                            color="error"
                            sx={{
                              position: 'absolute',
                              top: 4,
                              right: 4,
                              minWidth: 'auto',
                              width: 24,
                              height: 24,
                              borderRadius: '50%',
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveImage(index);
                            }}
                          >
                            <LucideIcon icon="eva:close-fill" width={16} />
                          </Button>
                        </Box>
                      </Box>
                    ))}
                  </Box>
                ) : (
                  <Box sx={{ textAlign: 'center' }}>
                    <LucideIcon icon="eva:cloud-upload-fill" sx={{ fontSize: 48, color: 'grey.400', mb: 1 }} />
                    <Typography variant="body2" color="text.secondary">
                      Click to upload images
                    </Typography>
                    <Typography variant="caption" color="text.disabled">
                      JPG, PNG, GIF up to 10MB each
                    </Typography>
                  </Box>
                )}
              </Box>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                style={{ display: 'none' }}
              />
            </Box>

            {/* Submit Button */}
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
