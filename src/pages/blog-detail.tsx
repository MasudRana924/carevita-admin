import { useParams } from 'react-router-dom';
import { useRef, useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';

import { useRouter } from 'src/routes/hooks';

import { DashboardContent } from 'src/layouts/dashboard';

import { Breadcrumb } from 'src/components/breadcrumb';
import { LucideIcon } from 'src/components/lucide-icons';

// ----------------------------------------------------------------------

const CATEGORIES = [
  'Technology',
  'Design',
  'Business',
  'Marketing',
  'Development',
  'Tutorial',
  'News',
  'Opinion',
];

const TAGS = [
  'React',
  'JavaScript',
  'TypeScript',
  'Node.js',
  'UI/UX',
  'Design',
  'Web Development',
  'Mobile',
  'API',
  'Database',
];

export default function BlogDetailPage() {
  const router = useRouter();
  const { id } = useParams();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Mock blog data - in real app, this would come from API based on ID
  // Here you would fetch the blog data using the id parameter
  console.log('Blog ID:', id);
  const [formData, setFormData] = useState({
    title: 'The Future of Web Development: Trends to Watch in 2024',
    description: 'Explore the latest trends in web development that will shape the industry in 2024 and beyond.',
    content: `Web development is constantly evolving, with new technologies and frameworks emerging every year. In 2024, we're seeing several key trends that are reshaping how we build and deploy web applications.

## 1. AI-Powered Development Tools

Artificial intelligence is revolutionizing the development process. From code completion to automated testing, AI tools are becoming indispensable for developers.

## 2. Performance-First Approach

With Core Web Vitals becoming a ranking factor, performance optimization is more important than ever. Developers are focusing on creating faster, more efficient applications.

## 3. Micro-Frontends Architecture

Breaking down large applications into smaller, manageable pieces is gaining popularity. This approach allows teams to work independently and deploy faster.

## 4. Serverless Computing

The serverless paradigm continues to grow, offering developers more flexibility and reduced operational overhead.

These trends are not just passing fads but fundamental shifts in how we approach web development. Staying ahead of these changes is crucial for any developer looking to remain competitive in the industry.`,
    category: 'Technology',
    author: 'John Doe',
    status: 'published',
  });

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('/assets/images/cover/cover-1.webp');
  const [selectedTags, setSelectedTags] = useState<string[]>(['React', 'JavaScript', 'Web Development']);

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

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleSaveChanges = useCallback(() => {
    // Handle form submission here
    console.log('Updated blog data:', formData);
    console.log('Selected tags:', selectedTags);
    console.log('Selected image:', selectedImage);
    // You can add a success notification here
  }, [formData, selectedTags, selectedImage]);

  return (
    <DashboardContent>
      <Box sx={{ mb: 5 }}>
        <Breadcrumb 
          title="Blog Details" 
          items={[
            { title: 'Dashboard', href: '/dashboard' },
            { title: 'Blog', href: '/dashboard/blog' },
            { title: 'Blog Details' }
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
        {/* Cover Image Section */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" sx={{ mb: 3 }}>
            Cover Image
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center' }}>
            <Box
              sx={{
                position: 'relative',
                width: 400,
                height: 300,
                borderRadius: 1,
                overflow: 'hidden',
                border: '1px solid',
                borderColor: 'divider',
              }}
            >
              <Box
                component="img"
                src={previewUrl}
                alt="Blog Cover"
                sx={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
            </Box>

            <Button
              variant="outlined"
              startIcon={<LucideIcon icon="eva:plus-fill" />}
              onClick={handleImageClick}
            >
              Change Cover Image
            </Button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              style={{ display: 'none' }}
            />
          </Box>
        </Box>

        <Typography variant="h6" sx={{ mb: 3 }}>
          Blog Information
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Basic Information */}
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
            label="Short Description"
            multiline
            rows={3}
            value={formData.description}
            onChange={handleInputChange('description')}
            slotProps={{
              inputLabel: { shrink: true },
            }}
          />

          <TextField
            fullWidth
            name="content"
            label="Content"
            multiline
            rows={12}
            value={formData.content}
            onChange={handleInputChange('content')}
            slotProps={{
              inputLabel: { shrink: true },
            }}
          />

          {/* Meta Information */}
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

            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={formData.status}
                label="Status"
                onChange={handleSelectChange('status')}
              >
                <MenuItem value="draft">Draft</MenuItem>
                <MenuItem value="published">Published</MenuItem>
                <MenuItem value="archived">Archived</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <TextField
            fullWidth
            name="author"
            label="Author"
            value={formData.author}
            onChange={handleInputChange('author')}
            slotProps={{
              inputLabel: { shrink: true },
            }}
          />

          {/* Tags */}
          <Box>
            <Typography variant="subtitle1" sx={{ mb: 2 }}>
              Tags
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {TAGS.map((tag) => (
                <Chip
                  key={tag}
                  label={tag}
                  onClick={() => handleTagToggle(tag)}
                  color={selectedTags.includes(tag) ? 'primary' : 'default'}
                  variant={selectedTags.includes(tag) ? 'filled' : 'outlined'}
                />
              ))}
            </Box>
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
