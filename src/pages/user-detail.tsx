import { useParams } from 'react-router-dom';
import { useRef, useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';

import { useRouter } from 'src/routes/hooks';

import { _users } from 'src/_mock';
import { DashboardContent } from 'src/layouts/dashboard';

import { useSnackbar } from 'src/components/snackbar';
import { Breadcrumb } from 'src/components/breadcrumb';
import { LucideIcon } from 'src/components/lucide-icons';

// ----------------------------------------------------------------------

const ROLES = [
  'Leader',
  'Hr Manager',
  'UI Designer',
  'UX Designer',
  'UI/UX Designer',
  'Project Manager',
  'Backend Developer',
  'Full Stack Designer',
  'Front End Developer',
  'Full Stack Developer',
];

const STATUS_OPTIONS = [
  { value: 'active', label: 'Active' },
  { value: 'banned', label: 'Banned' },
  { value: 'pending', label: 'Pending' },
];

export default function UserDetailPage() {
  const router = useRouter();
  const { id } = useParams();
  const { showSnackbar } = useSnackbar();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Find user data from mock data based on ID
  const userData = _users.find(user => user.id === id);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '+1 (555) 123-4567',
    address: '123 Main Street, New York, NY 10001',
    company: '',
    role: '',
    bio: 'Experienced full-stack developer with 5+ years of experience in React, Node.js, and cloud technologies. Passionate about creating scalable and user-friendly applications.',
    website: 'https://johndoe.dev',
    linkedin: 'https://linkedin.com/in/johndoe',
    github: 'https://github.com/johndoe',
  });

  // Load user data when component mounts
  useEffect(() => {
    if (userData) {
      setFormData(prev => ({
        ...prev,
        name: userData.name,
        email: `user${userData.id}@example.com`, // Mock email
        company: userData.company,
        role: userData.role,
      }));
    }
  }, [userData]);

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('/assets/images/avatar/avatar-1.webp');
  const [status, setStatus] = useState('active');
  const [isVerified, setIsVerified] = useState(true);

  const handleInputChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const handleSelectChange = (field: string) => (event: any) => {
    if (field === 'status') {
      setStatus(event.target.value);
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: event.target.value,
      }));
    }
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

  const handleSaveChanges = useCallback(() => {
    // Basic validation
    if (!formData.name || !formData.email || !formData.company || !formData.role) {
      showSnackbar('Please fill in all required fields', 'error');
      return;
    }
    
    // Simulate API call
    try {
      // Here you would make an API call to update the user
      console.log('Updated user data:', formData);
      console.log('Status:', status);
      console.log('Is verified:', isVerified);
      console.log('Selected image:', selectedImage);
      
      // Redirect to user table after successful update
      setTimeout(() => {
        router.push('/dashboard/user?refresh=true&action=updated');
      }, 1500);
    } catch (error) {
      showSnackbar('Failed to update user. Please try again.', 'error');
    }
  }, [formData, status, isVerified, selectedImage, showSnackbar, router]);

  return (
    <DashboardContent>
      <Box sx={{ mb: 5 }}>
        <Breadcrumb 
          title="User Details" 
          items={[
            { title: 'Dashboard', href: '/dashboard' },
            { title: 'Users', href: '/dashboard/user' },
            { title: 'User Details' }
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
        {/* Profile Picture Section */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center', mb: 4 }}>
          <Avatar
            src={previewUrl}
            alt={formData.name}
            sx={{
              width: 200,
              height: 200,
              mb: 2,
              border: '4px solid',
              borderColor: 'divider',
            }}
          />

          <Button
            variant="outlined"
            startIcon={<LucideIcon icon="eva:plus-fill" />}
            onClick={handleImageClick}
          >
            Change Photo
          </Button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            style={{ display: 'none' }}
          />
        </Box>

        <Typography variant="h6" sx={{ mb: 3 }}>
          User Information
        </Typography>

                 <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
           {/* Basic Information */}
           <Box sx={{ display: 'flex', gap: 2 }}>
             <TextField
               sx={{ flex: 1 }}
               name="name"
               label="Full Name"
               value={formData.name}
               onChange={handleInputChange('name')}
               slotProps={{
                 inputLabel: { shrink: true },
               }}
             />
             <TextField
               sx={{ flex: 1 }}
               name="email"
               label="Email Address"
               type="email"
               value={formData.email}
               onChange={handleInputChange('email')}
               slotProps={{
                 inputLabel: { shrink: true },
               }}
             />
           </Box>

           <Box sx={{ display: 'flex', gap: 2 }}>
             <TextField
               sx={{ flex: 1 }}
               name="phone"
               label="Phone Number"
               value={formData.phone}
               onChange={handleInputChange('phone')}
               slotProps={{
                 inputLabel: { shrink: true },
               }}
             />
             <TextField
               sx={{ flex: 1 }}
               name="company"
               label="Company"
               value={formData.company}
               onChange={handleInputChange('company')}
               slotProps={{
                 inputLabel: { shrink: true },
               }}
             />
           </Box>

           <TextField
             fullWidth
             name="address"
             label="Address"
             multiline
             rows={2}
             value={formData.address}
             onChange={handleInputChange('address')}
             slotProps={{
               inputLabel: { shrink: true },
             }}
           />

           <Box sx={{ display: 'flex', gap: 2 }}>
             <FormControl sx={{ flex: 1 }}>
               <InputLabel>Role</InputLabel>
               <Select
                 value={formData.role}
                 label="Role"
                 onChange={handleSelectChange('role')}
               >
                 {ROLES.map((role) => (
                   <MenuItem key={role} value={role}>
                     {role}
                   </MenuItem>
                 ))}
               </Select>
             </FormControl>
             <FormControl sx={{ flex: 1 }}>
               <InputLabel>Status</InputLabel>
               <Select
                 value={status}
                 label="Status"
                 onChange={handleSelectChange('status')}
               >
                 {STATUS_OPTIONS.map((option) => (
                   <MenuItem key={option.value} value={option.value}>
                     {option.label}
                   </MenuItem>
                 ))}
               </Select>
             </FormControl>
           </Box>

           <TextField
             fullWidth
             name="bio"
             label="Bio"
             multiline
             rows={4}
             value={formData.bio}
             onChange={handleInputChange('bio')}
             slotProps={{
               inputLabel: { shrink: true },
             }}
           />

           {/* Social Links */}
           <Box sx={{ display: 'flex', gap: 2 }}>
             <TextField
               sx={{ flex: 1 }}
               name="website"
               label="Website"
               value={formData.website}
               onChange={handleInputChange('website')}
               slotProps={{
                 inputLabel: { shrink: true },
               }}
             />
             <TextField
               sx={{ flex: 1 }}
               name="linkedin"
               label="LinkedIn"
               value={formData.linkedin}
               onChange={handleInputChange('linkedin')}
               slotProps={{
                 inputLabel: { shrink: true },
               }}
             />
             <TextField
               sx={{ flex: 1 }}
               name="github"
               label="GitHub"
               value={formData.github}
               onChange={handleInputChange('github')}
               slotProps={{
                 inputLabel: { shrink: true },
               }}
             />
           </Box>

          {/* Status Options */}
          <Box>
            <FormControlLabel
              control={
                <Checkbox
                  checked={isVerified}
                  onChange={(e) => setIsVerified(e.target.checked)}
                />
              }
              label="Email Verified"
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
