import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';

import { DashboardContent } from 'src/layouts/dashboard';
import { Breadcrumb } from 'src/components/breadcrumb';
import { ErrorState } from 'src/components/page-states';
import { useSnackbar } from 'src/components/snackbar';
import { hospitalsApi } from 'src/lib/api';
import { getErrorMessage, getRecordId, pickString } from 'src/lib/utils';
import { adminHospitalsService } from 'src/api/admin-services';

export function HospitalEditView() {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();
  const [formData, setFormData] = useState({
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
  });
  const [photo, setPhoto] = useState<File | undefined>();

  const query = useQuery({
    queryKey: ['admin-hospital-edit', id],
    queryFn: async () => {
      for (let page = 1; page <= 20; page += 1) {
        const result = await hospitalsApi.list({ page, limit: 50 });
        const match = result.items.find((item) => getRecordId(item) === id);
        if (match) return match;
        if (result.items.length < 50) break;
      }
      return null;
    },
    enabled: Boolean(id),
  });

  useEffect(() => {
    if (!query.data) return;
    setFormData({
      name: pickString(query.data, ['name'], ''),
      address: pickString(query.data, ['address'], '') === '—' ? '' : pickString(query.data, ['address'], ''),
      phone: pickString(query.data, ['phone'], '') === '—' ? '' : pickString(query.data, ['phone'], ''),
      email: pickString(query.data, ['email'], '') === '—' ? '' : pickString(query.data, ['email'], ''),
      city: pickString(query.data, ['city'], '') === '—' ? '' : pickString(query.data, ['city'], ''),
      district: pickString(query.data, ['district'], '') === '—' ? '' : pickString(query.data, ['district'], ''),
      type: pickString(query.data, ['type'], '') === '—' ? '' : pickString(query.data, ['type'], ''),
      details: pickString(query.data, ['details'], '') === '—' ? '' : pickString(query.data, ['details'], ''),
      location_lat:
        pickString(query.data, ['location_lat'], '') === '—'
          ? ''
          : pickString(query.data, ['location_lat'], ''),
      location_long:
        pickString(query.data, ['location_long'], '') === '—'
          ? ''
          : pickString(query.data, ['location_long'], ''),
    });
  }, [query.data]);

  const mutation = useMutation({
    mutationFn: () =>
      adminHospitalsService.updateHospital(id, {
        ...formData,
        photo,
      }),
    onSuccess: () => {
      showSnackbar('Hospital updated successfully', 'success');
      navigate('/hospitals');
    },
    onError: (error) => showSnackbar(getErrorMessage(error), 'error'),
  });

  return (
    <DashboardContent>
      <Breadcrumb
        title="Edit Hospital"
        items={[
          { title: 'Dashboard', href: '/dashboard' },
          { title: 'Hospitals', href: '/hospitals' },
          { title: 'Edit Hospital' },
        ]}
      />
      {query.error || (!query.isLoading && !query.data) ? (
        <ErrorState
          message={query.error ? getErrorMessage(query.error) : 'Hospital not found'}
          onRetry={() => query.refetch()}
        />
      ) : (
        <Card>
          <CardHeader title="Update hospital" />
          <CardContent>
            <Box component="form" sx={{ maxWidth: 800 }} onSubmit={(event) => event.preventDefault()}>
              <Stack spacing={3}>
                {Object.entries({
                  name: 'Hospital Name *',
                  address: 'Address',
                  phone: 'Phone',
                  email: 'Email',
                  city: 'City',
                  district: 'District',
                  type: 'Type',
                  location_lat: 'Latitude',
                  location_long: 'Longitude',
                  details: 'Details',
                }).map(([key, label]) => (
                  <TextField
                    key={key}
                    fullWidth
                    required={key === 'name'}
                    label={label}
                    multiline={key === 'address' || key === 'details'}
                    minRows={key === 'details' ? 4 : key === 'address' ? 2 : undefined}
                    value={formData[key as keyof typeof formData]}
                    onChange={(event) => setFormData((prev) => ({ ...prev, [key]: event.target.value }))}
                  />
                ))}
                <Button variant="outlined" component="label">
                  {photo ? photo.name : 'Replace photo'}
                  <input
                    hidden
                    type="file"
                    accept="image/*"
                    onChange={(event) => setPhoto(event.target.files?.[0])}
                  />
                </Button>
                <Stack direction="row" spacing={2} justifyContent="flex-end">
                  <Button variant="outlined" onClick={() => navigate('/hospitals')}>
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    disabled={mutation.isPending || !formData.name}
                    onClick={() => mutation.mutate()}
                  >
                    {mutation.isPending ? 'Saving...' : 'Save'}
                  </Button>
                </Stack>
              </Stack>
            </Box>
          </CardContent>
        </Card>
      )}
    </DashboardContent>
  );
}
