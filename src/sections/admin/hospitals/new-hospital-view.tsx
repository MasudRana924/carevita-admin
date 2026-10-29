import type { ReactNode } from 'react';

import { useEffect, useMemo, useRef, useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

import { DashboardContent } from 'src/layouts/dashboard';

import { Breadcrumb } from 'src/components/breadcrumb';
import { Iconify } from 'src/components/iconify';
import { iconFieldSlotProps } from 'src/components/detail-ui';
import { useSnackbar } from 'src/components/snackbar';
import { useHospitals } from 'src/hooks/useAdminApi';

// ----------------------------------------------------------------------

const EMPTY_FORM = {
  name: '',
  address: '',
  phone: '',
  email: '',
  city: '',
  district: '',
  type: '',
  details: '',
  location_lat: '',
  location_long: '',
};

type FormField = keyof typeof EMPTY_FORM;

const TYPE_SUGGESTIONS = ['Private', 'Government', 'Specialized', 'Clinic', 'Diagnostic center'];

const MAX_PHOTO_BYTES = 5 * 1024 * 1024;

const CARD_SX = {
  p: 3,
  borderRadius: 2,
  border: '1px solid',
  borderColor: 'divider',
  boxShadow: 'none',
} as const;

const TWO_COLUMNS_SX = {
  display: 'grid',
  gap: 2.5,
  gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
} as const;

const adornment = (icon: string) => iconFieldSlotProps(icon);

export type HospitalFormValues = typeof EMPTY_FORM;

export const EMPTY_HOSPITAL_FORM: HospitalFormValues = EMPTY_FORM;

type HospitalFormProps = {
  initialValues?: HospitalFormValues;
  existingPhotoUrl?: string | null;
  submitting: boolean;
  submitLabel: string;
  submittingLabel: string;
  summaryTitle: string;
  summaryText: string;
  secondaryAction: { label: string; icon: string; onClick?: () => void; resetsForm?: boolean };
  /** Return `true` on success to clear the form. */
  onSubmit: (values: HospitalFormValues, photo: File | null) => Promise<boolean | void>;
};

export function HospitalForm({
  initialValues = EMPTY_FORM,
  existingPhotoUrl,
  submitting,
  submitLabel,
  submittingLabel,
  summaryTitle,
  summaryText,
  secondaryAction,
  onSubmit,
}: HospitalFormProps) {
  const { showSnackbar } = useSnackbar();
  const loading = submitting;
  const [formData, setFormData] = useState(initialValues);
  const [photo, setPhoto] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setFormData(initialValues);
  }, [initialValues]);

  const localPreview = useMemo(() => (photo ? URL.createObjectURL(photo) : null), [photo]);
  const photoPreview = localPreview || existingPhotoUrl || null;

  useEffect(
    () => () => {
      if (localPreview) URL.revokeObjectURL(localPreview);
    },
    [localPreview]
  );

  const handleInputChange = (field: FormField) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const selectPhoto = (file?: File | null) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      showSnackbar('Please choose an image file', 'error');
      return;
    }
    if (file.size > MAX_PHOTO_BYTES) {
      showSnackbar('Photo must be 5 MB or smaller', 'error');
      return;
    }
    setPhoto(file);
  };

  const handleReset = () => {
    setFormData(EMPTY_FORM);
    setPhoto(null);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!formData.name.trim()) {
      showSnackbar('Hospital name is required', 'error');
      return;
    }
    const success = await onSubmit(formData, photo);
    if (success) handleReset();
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, lg: 8 }}>
          <Stack spacing={3}>
            <FormSection
              icon="solar:hospital-bold-duotone"
              color="primary"
              title="Basic information"
              subtitle="Name, type and a short description shown to families"
            >
              <Stack spacing={2.5}>
                <TextField
                  fullWidth
                  required
                  label="Hospital name"
                  value={formData.name}
                  onChange={handleInputChange('name')}
                  slotProps={adornment('solar:buildings-2-bold-duotone')}
                />
                <Box>
                  <TextField
                    fullWidth
                    label="Hospital type"
                    value={formData.type}
                    onChange={handleInputChange('type')}
                    placeholder="e.g. Private, Government"
                    slotProps={adornment('solar:tag-bold-duotone')}
                  />
                  <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mt: 1.25 }}>
                    {TYPE_SUGGESTIONS.map((option) => {
                      const active = formData.type === option;
                      return (
                        <Chip
                          key={option}
                          label={option}
                          size="small"
                          color={active ? 'primary' : 'default'}
                          variant={active ? 'filled' : 'outlined'}
                          onClick={() =>
                            setFormData((prev) => ({ ...prev, type: active ? '' : option }))
                          }
                        />
                      );
                    })}
                  </Stack>
                </Box>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Details"
                  value={formData.details}
                  onChange={handleInputChange('details')}
                  placeholder="Departments, facilities, visiting hours…"
                  slotProps={iconFieldSlotProps('solar:document-text-bold-duotone', {
                    multiline: true,
                  })}
                />
              </Stack>
            </FormSection>

            <FormSection
              icon="solar:phone-calling-bold-duotone"
              color="info"
              title="Contact"
              subtitle="How families and caregivers can reach the hospital"
            >
              <Box sx={TWO_COLUMNS_SX}>
                <TextField
                  fullWidth
                  label="Phone"
                  value={formData.phone}
                  onChange={handleInputChange('phone')}
                  placeholder="+880 1XXX-XXXXXX"
                  slotProps={adornment('solar:phone-bold-duotone')}
                />
                <TextField
                  fullWidth
                  type="email"
                  label="Email"
                  value={formData.email}
                  onChange={handleInputChange('email')}
                  placeholder="info@hospital.com"
                  slotProps={adornment('solar:letter-bold-duotone')}
                />
              </Box>
            </FormSection>

            <FormSection
              icon="solar:map-point-bold-duotone"
              color="warning"
              title="Location"
              subtitle="Address and map coordinates"
            >
              <Stack spacing={2.5}>
                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  label="Address"
                  value={formData.address}
                  onChange={handleInputChange('address')}
                  placeholder="House, road, area"
                  slotProps={iconFieldSlotProps('solar:map-point-bold-duotone', {
                    multiline: true,
                  })}
                />
                <Box sx={TWO_COLUMNS_SX}>
                  <TextField
                    fullWidth
                    label="City"
                    value={formData.city}
                    onChange={handleInputChange('city')}
                    slotProps={adornment('solar:city-bold-duotone')}
                  />
                  <TextField
                    fullWidth
                    label="District"
                    value={formData.district}
                    onChange={handleInputChange('district')}
                    slotProps={adornment('solar:map-bold-duotone')}
                  />
                  <TextField
                    fullWidth
                    label="Latitude"
                    value={formData.location_lat}
                    onChange={handleInputChange('location_lat')}
                    placeholder="23.8103"
                    slotProps={adornment('solar:global-bold-duotone')}
                  />
                  <TextField
                    fullWidth
                    label="Longitude"
                    value={formData.location_long}
                    onChange={handleInputChange('location_long')}
                    placeholder="90.4125"
                    slotProps={adornment('solar:global-bold-duotone')}
                  />
                </Box>
              </Stack>
            </FormSection>
          </Stack>
        </Grid>

        <Grid size={{ xs: 12, lg: 4 }}>
          <Stack spacing={3} sx={{ position: { lg: 'sticky' }, top: { lg: 88 } }}>
            <FormSection
              icon="solar:gallery-bold-duotone"
              color="secondary"
              title="Hospital photo"
              subtitle="JPG or PNG, up to 5 MB"
            >
              <input
                ref={fileInputRef}
                hidden
                type="file"
                accept="image/*"
                onChange={(event) => {
                  selectPhoto(event.target.files?.[0]);
                  event.target.value = '';
                }}
              />

              {photoPreview ? (
                <Box sx={{ position: 'relative', borderRadius: 1.5, overflow: 'hidden' }}>
                  <Box
                    component="img"
                    src={photoPreview}
                    alt="Hospital photo preview"
                    referrerPolicy="no-referrer"
                    sx={{ display: 'block', width: 1, height: 220, objectFit: 'cover' }}
                  />
                  <Stack
                    direction="row"
                    spacing={1}
                    sx={{ position: 'absolute', top: 8, right: 8 }}
                  >
                    <IconButton
                      size="small"
                      aria-label="Change photo"
                      onClick={() => fileInputRef.current?.click()}
                      sx={{
                        bgcolor: 'rgba(0,0,0,0.48)',
                        color: 'common.white',
                        '&:hover': { bgcolor: 'rgba(0,0,0,0.64)' },
                      }}
                    >
                      <Iconify icon="solar:pen-bold" width={18} />
                    </IconButton>
                    {photo && (
                      <IconButton
                        size="small"
                        aria-label="Remove selected photo"
                        onClick={() => setPhoto(null)}
                        sx={{
                          bgcolor: 'rgba(0,0,0,0.48)',
                          color: 'common.white',
                          '&:hover': { bgcolor: 'rgba(0,0,0,0.64)' },
                        }}
                      >
                        <Iconify icon="solar:trash-bin-trash-bold" width={18} />
                      </IconButton>
                    )}
                  </Stack>
                  <Box sx={{ px: 1.5, py: 1, bgcolor: 'background.neutral' }}>
                    <Typography variant="caption" noWrap component="div" title={photo?.name}>
                      {photo ? photo.name : 'Current photo · click the pencil to replace'}
                    </Typography>
                  </Box>
                </Box>
              ) : (
                <Box
                  role="button"
                  tabIndex={0}
                  onClick={() => fileInputRef.current?.click()}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') fileInputRef.current?.click();
                  }}
                  onDragOver={(event) => {
                    event.preventDefault();
                    setDragging(true);
                  }}
                  onDragLeave={() => setDragging(false)}
                  onDrop={(event) => {
                    event.preventDefault();
                    setDragging(false);
                    selectPhoto(event.dataTransfer.files?.[0]);
                  }}
                  sx={{
                    py: 5,
                    px: 2,
                    cursor: 'pointer',
                    textAlign: 'center',
                    borderRadius: 1.5,
                    border: '1px dashed',
                    borderColor: dragging ? 'primary.main' : 'divider',
                    bgcolor: dragging ? 'primary.lighter' : 'background.neutral',
                    transition: 'all 160ms ease',
                    '&:hover': { borderColor: 'primary.main', bgcolor: 'primary.lighter' },
                  }}
                >
                  <Box
                    sx={{
                      mx: 'auto',
                      mb: 1.5,
                      width: 56,
                      height: 56,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: '50%',
                      color: 'primary.main',
                      bgcolor: 'background.paper',
                    }}
                  >
                    <Iconify icon="solar:cloud-upload-bold-duotone" width={30} />
                  </Box>
                  <Typography variant="subtitle2">Drop a photo here or click to browse</Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    A wide exterior photo works best
                  </Typography>
                </Box>
              )}
            </FormSection>

            <Card sx={CARD_SX}>
              <Typography variant="subtitle1">{summaryTitle}</Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                {summaryText}
              </Typography>
              <Divider sx={{ my: 2.5, borderStyle: 'dashed' }} />
              <Stack spacing={1.5}>
                <Button
                  fullWidth
                  size="large"
                  type="submit"
                  variant="contained"
                  disabled={loading}
                  startIcon={
                    loading ? (
                      <CircularProgress size={18} color="inherit" />
                    ) : (
                      <Iconify icon="solar:check-circle-bold" />
                    )
                  }
                >
                  {loading ? submittingLabel : submitLabel}
                </Button>
                <Button
                  fullWidth
                  variant="outlined"
                  color="inherit"
                  disabled={loading}
                  startIcon={<Iconify icon={secondaryAction.icon} />}
                  onClick={() => {
                    if (secondaryAction.resetsForm) handleReset();
                    secondaryAction.onClick?.();
                  }}
                >
                  {secondaryAction.label}
                </Button>
              </Stack>
            </Card>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
}

export function NewHospitalView() {
  const { showSnackbar } = useSnackbar();
  const { createHospital } = useHospitals();
  const [loading, setLoading] = useState(false);

  const handleCreate = async (values: HospitalFormValues, photo: File | null) => {
    setLoading(true);
    try {
      await createHospital({
        name: values.name,
        address: values.address,
        phone: values.phone,
        email: values.email,
        city: values.city,
        district: values.district,
        type: values.type,
        details: values.details,
        location_lat: values.location_lat || undefined,
        location_long: values.location_long || undefined,
        photo: photo || undefined,
      });
      showSnackbar('Hospital created successfully', 'success');
      return true;
    } catch (error: any) {
      showSnackbar(error.message || 'Failed to create hospital', 'error');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardContent>
      <Breadcrumb
        title="New Hospital"
        items={[
          { title: 'Dashboard', href: '/dashboard' },
          { title: 'Hospitals', href: '/hospitals' },
          { title: 'New Hospital' },
        ]}
      />

      <HospitalForm
        submitting={loading}
        submitLabel="Create hospital"
        submittingLabel="Creating…"
        summaryTitle="Ready to publish?"
        summaryText="Only the hospital name is required. You can edit everything later."
        secondaryAction={{ label: 'Reset form', icon: 'solar:restart-bold', resetsForm: true }}
        onSubmit={handleCreate}
      />
    </DashboardContent>
  );
}

// ----------------------------------------------------------------------

function FormSection({
  icon,
  color,
  title,
  subtitle,
  children,
}: {
  icon: string;
  color: 'primary' | 'secondary' | 'info' | 'warning';
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <Card sx={CARD_SX}>
      <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 3 }}>
        <Box
          sx={{
            width: 40,
            height: 40,
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 1.25,
            color: `${color}.main`,
            bgcolor: `${color}.lighter`,
          }}
        >
          <Iconify icon={icon} width={22} />
        </Box>
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="subtitle1">{title}</Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            {subtitle}
          </Typography>
        </Box>
      </Stack>
      {children}
    </Card>
  );
}
