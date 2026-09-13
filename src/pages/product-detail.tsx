import { useParams } from 'react-router-dom';
import { useRef, useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
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

export default function ProductDetailPage() {
  const router = useRouter();
  const { id } = useParams();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Mock product data - in real app, this would come from API based on ID
  // Here you would fetch the product data using the id parameter
  console.log('Product ID:', id);
  const [formData, setFormData] = useState({
    name: 'Wireless Bluetooth Headphones',
    description: 'High-quality wireless headphones with noise cancellation feature. Perfect for music lovers and professionals who need clear audio during calls.',
    price: '299.99',
    salePrice: '249.99',
    category: 'Electronics',
    sku: 'WH-BT-001',
    stock: '150',
    weight: '0.5',
    dimensions: '18 x 8 x 4 cm',
  });

  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([
    '/assets/images/product/product-1.webp',
    '/assets/images/product/product-2.webp',
  ]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>(['M', 'L']);
  const [selectedColors, setSelectedColors] = useState<string[]>(['Black', 'White']);
  const [isOnSale, setIsOnSale] = useState(true);
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
      prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
    );
  };

  const handleColorToggle = (color: string) => {
    setSelectedColors(prev =>
      prev.includes(color) ? prev.filter(c => c !== color) : [...prev, color]
    );
  };

  const handleSaveChanges = useCallback(() => {
    // Handle form submission here
    console.log('Updated product data:', formData);
    console.log('Selected sizes:', selectedSizes);
    console.log('Selected colors:', selectedColors);
    console.log('Is on sale:', isOnSale);
    console.log('Is available:', isAvailable);
    // You can add a success notification here
  }, [formData, selectedSizes, selectedColors, isOnSale, isAvailable]);

  return (
    <DashboardContent>
      <Box sx={{ mb: 5 }}>
        <Breadcrumb 
          title="Product Details" 
          items={[
            { title: 'Dashboard', href: '/dashboard' },
            { title: 'Products', href: '/dashboard/products' },
            { title: 'Product Details' }
          ]} 
        />
      </Box>

             <Box sx={{ display: 'flex', gap: 3, mb: 3 }}>
         <Button
           variant="outlined"
           startIcon={<LucideIcon icon="eva:arrow-ios-back-fill" />}
           onClick={() => router.back()}
           sx={{
             borderColor: 'grey.400',
             color: 'grey.700',
             boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
             '&:hover': {
               borderColor: 'grey.600',
               backgroundColor: 'grey.50',
             },
           }}
         >
           Back
         </Button>
       </Box>

             <Card sx={{ 
         p: 3, 
         border: '1px solid #E0E0E0',
         boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
         backgroundColor: '#FFFFFF'
       }}>
        {/* Product Images Section */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" sx={{ mb: 3 }}>
            Product Images
          </Typography>

          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            {previewUrls.map((url, index) => (
              <Box
                key={index}
                sx={{
                  position: 'relative',
                  width: 200,
                  height: 200,
                  borderRadius: 1,
                  overflow: 'hidden',
                  border: '1px solid',
                  borderColor: 'divider',
                }}
              >
                <Box
                  component="img"
                  src={url}
                  alt={`Product ${index + 1}`}
                  sx={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
                <Button
                  size="small"
                  color="error"
                  variant="contained"
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    minWidth: 'auto',
                    width: 32,
                    height: 32,
                  }}
                  onClick={() => handleRemoveImage(index)}
                >
                  <LucideIcon icon="eva:close-fill" />
                </Button>
              </Box>
            ))}

            <Button
              variant="outlined"
              startIcon={<LucideIcon icon="eva:plus-fill" />}
              onClick={handleImageClick}
              sx={{ 
                width: 200, 
                height: 200,
                border: '2px dashed',
                borderColor: 'divider',
              }}
            >
              Add Image
            </Button>

            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              style={{ display: 'none' }}
            />
          </Box>
        </Box>

        <Typography variant="h6" sx={{ mb: 3 }}>
          Product Information
        </Typography>

                 <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
           {/* Basic Information */}
           <Box sx={{ display: 'flex', gap: 2 }}>
             <TextField
               sx={{ flex: 2 }}
               name="name"
               label="Product Name"
               value={formData.name}
               onChange={handleInputChange('name')}
               slotProps={{
                 inputLabel: { shrink: true },
               }}
             />
             <TextField
               sx={{ flex: 1 }}
               name="sku"
               label="SKU"
               value={formData.sku}
               onChange={handleInputChange('sku')}
               slotProps={{
                 inputLabel: { shrink: true },
               }}
             />
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
           <Box sx={{ display: 'flex', gap: 2 }}>
             <TextField
               sx={{ flex: 1 }}
               name="price"
               label="Regular Price"
               type="number"
               value={formData.price}
               onChange={handleInputChange('price')}
               slotProps={{
                 inputLabel: { shrink: true },
               }}
             />
             <TextField
               sx={{ flex: 1 }}
               name="salePrice"
               label="Sale Price"
               type="number"
               value={formData.salePrice}
               onChange={handleInputChange('salePrice')}
               slotProps={{
                 inputLabel: { shrink: true },
               }}
             />
             <FormControl sx={{ flex: 1 }}>
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
           </Box>

           {/* Inventory */}
           <Box sx={{ display: 'flex', gap: 2 }}>
             <TextField
               sx={{ flex: 1 }}
               name="stock"
               label="Stock Quantity"
               type="number"
               value={formData.stock}
               onChange={handleInputChange('stock')}
               slotProps={{
                 inputLabel: { shrink: true },
               }}
             />
             <TextField
               sx={{ flex: 1 }}
               name="weight"
               label="Weight (kg)"
               type="number"
               value={formData.weight}
               onChange={handleInputChange('weight')}
               slotProps={{
                 inputLabel: { shrink: true },
               }}
             />
             <TextField
               sx={{ flex: 1 }}
               name="dimensions"
               label="Dimensions"
               value={formData.dimensions}
               onChange={handleInputChange('dimensions')}
               slotProps={{
                 inputLabel: { shrink: true },
               }}
             />
           </Box>

          {/* Options */}
          <Box>
            <Typography variant="subtitle1" sx={{ mb: 2 }}>
              Available Sizes
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {SIZES.map((size) => (
                <Chip
                  key={size}
                  label={size}
                  onClick={() => handleSizeToggle(size)}
                  color={selectedSizes.includes(size) ? 'primary' : 'default'}
                  variant={selectedSizes.includes(size) ? 'filled' : 'outlined'}
                />
              ))}
            </Box>
          </Box>

          <Box>
            <Typography variant="subtitle1" sx={{ mb: 2 }}>
              Available Colors
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {COLORS.map((color) => (
                <Chip
                  key={color}
                  label={color}
                  onClick={() => handleColorToggle(color)}
                  color={selectedColors.includes(color) ? 'primary' : 'default'}
                  variant={selectedColors.includes(color) ? 'filled' : 'outlined'}
                />
              ))}
            </Box>
          </Box>

          {/* Status */}
          <Box>
            <FormControlLabel
              control={
                <Checkbox
                  checked={isOnSale}
                  onChange={(e) => setIsOnSale(e.target.checked)}
                />
              }
              label="On Sale"
            />
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

                     {/* Save Changes Button */}
           <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
             <Button
               variant="contained"
               size="large"
               onClick={handleSaveChanges}
             >
               Save Changes
             </Button>
           </Box>
        </Box>
      </Card>
    </DashboardContent>
  );
}
