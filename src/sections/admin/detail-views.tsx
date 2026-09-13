import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { useState } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { DashboardContent } from 'src/layouts/dashboard';
import { PageHeader } from 'src/components/page-header';
import { RecordFields } from 'src/components/record-fields';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { DetailSkeleton, ErrorState } from 'src/components/page-states';
import { useSnackbar } from 'src/components/snackbar';
import {
  ambulanceApi,
  appointmentsApi,
  bookingsApi,
  caregiversApi,
  diagnosticsApi,
  disputesApi,
  doctorsApi,
  emergencyApi,
  helpingHandsApi,
  hospitalsApi,
  medicinesApi,
  nursesApi,
  ordersApi,
  paymentsApi,
  reviewsApi,
  supportApi,
  withdrawalsApi,
} from 'src/lib/api';
import { getErrorMessage, getRecordId, pickString } from 'src/lib/utils';

export { UserDetailView } from './user-detail-view';

function asRecord(value: unknown): Record<string, unknown> {
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }
  return {};
}

function DetailShell({
  title,
  loading,
  error,
  onRetry,
  children,
  action,
}: {
  title: string;
  loading: boolean;
  error?: string | null;
  onRetry?: () => void;
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <DashboardContent maxWidth="xl">
      {loading ? (
        <DetailSkeleton />
      ) : (
        <>
          <PageHeader title={title} action={action} />
          {error ? <ErrorState message={error} onRetry={onRetry} /> : children}
        </>
      )}
    </DashboardContent>
  );
}

export function ProviderDetailView({ type }: { type: 'provider' | 'nurse' | 'caregiver' }) {
  const { id = '' } = useParams();
  const [tab, setTab] = useState(0);
  const query = useQuery({
    queryKey: [type, id],
    queryFn: () => (type === 'nurse' ? nursesApi.get(id) : caregiversApi.get(id)),
  });
  const record = asRecord(query.data?.data);
  const reviewsQuery = useQuery({
    queryKey: ['reviews-provider', id],
    queryFn: () => reviewsApi.provider({ provider_id: id, provider_type: type === 'nurse' ? 'NURSE' : 'CAREGIVER' }),
    enabled: tab === 5,
  });

  return (
    <DetailShell
      title={pickString(record, ['name'], type === 'nurse' ? 'Nurse details' : 'Provider details')}
      loading={query.isLoading}
      error={query.error ? getErrorMessage(query.error) : null}
      onRetry={() => query.refetch()}
    >
      <Tabs value={tab} onChange={(_, value) => setTab(value)} sx={{ mb: 3 }}>
        {['Profile', 'Services', 'Documents', 'Availability', 'Bookings', 'Reviews', 'Earnings'].map((label) => (
          <Tab key={label} label={label} />
        ))}
      </Tabs>
      {tab === 0 && <RecordFields record={record} />}
      {tab === 5 && <RecordFields title="Reviews" record={asRecord(reviewsQuery.data?.data)} />}
      {tab !== 0 && tab !== 5 && (
        <Card sx={{ p: 3 }}>
          <Typography color="text.secondary">
            This tab is shown only when the related API returns data for the selected provider.
          </Typography>
        </Card>
      )}
    </DetailShell>
  );
}

export function SimpleDetailView({
  title,
  queryKey,
  fetcher,
}: {
  title: string;
  queryKey: string;
  fetcher: (id: string) => Promise<unknown>;
}) {
  const { id = '' } = useParams();
  const query = useQuery({
    queryKey: [queryKey, id],
    queryFn: async () => {
      const result = await fetcher(id);
      return asRecord((result as { data?: unknown }).data ?? result);
    },
  });

  return (
    <DetailShell
      title={pickString(query.data, ['name', 'booking_number', 'order_number', 'subject', 'title'], title)}
      loading={query.isLoading}
      error={query.error ? getErrorMessage(query.error) : null}
      onRetry={() => query.refetch()}
    >
      <RecordFields record={query.data} />
    </DetailShell>
  );
}

export function BookingDetailView() {
  return <SimpleDetailView title="Booking details" queryKey="booking" fetcher={(id) => bookingsApi.get(id)} />;
}

export function PaymentDetailView() {
  const { id = '' } = useParams();
  const { showSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState('');
  const query = useQuery({
    queryKey: ['payment', id],
    queryFn: async () => asRecord((await paymentsApi.get(id)).data),
  });
  const refund = useMutation({
    mutationFn: () => paymentsApi.refund(id, { reason }),
    onSuccess: () => {
      showSnackbar('Refund processed successfully', 'success');
      setOpen(false);
      queryClient.invalidateQueries({ queryKey: ['payment', id] });
    },
    onError: (error) => showSnackbar(getErrorMessage(error), 'error'),
  });

  return (
    <DetailShell
      title="Payment details"
      loading={query.isLoading}
      error={query.error ? getErrorMessage(query.error) : null}
      onRetry={() => query.refetch()}
      action={
        <Button color="error" variant="contained" onClick={() => setOpen(true)}>
          Refund
        </Button>
      }
    >
      <RecordFields record={query.data} />
      <ConfirmDialog
        open={open}
        onClose={() => setOpen(false)}
        title="Refund payment"
        content={
          <TextField
            fullWidth
            label="Refund reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            sx={{ mt: 1 }}
          />
        }
        action={
          <Button
            color="error"
            variant="contained"
            disabled={!reason || refund.isPending}
            onClick={() => refund.mutate()}
          >
            Refund
          </Button>
        }
      />
    </DetailShell>
  );
}

export function OrderDetailView() {
  const { id = '' } = useParams();
  const { showSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const [status, setStatus] = useState('');
  const [open, setOpen] = useState(false);
  const query = useQuery({
    queryKey: ['order', id],
    queryFn: async () => asRecord((await ordersApi.get(id)).data),
  });
  const mutation = useMutation({
    mutationFn: () => ordersApi.updateStatus(id, { status }),
    onSuccess: () => {
      showSnackbar('Order updated successfully', 'success');
      setOpen(false);
      queryClient.invalidateQueries({ queryKey: ['order', id] });
    },
    onError: (error) => showSnackbar(getErrorMessage(error), 'error'),
  });

  return (
    <DetailShell
      title={pickString(query.data, ['order_number'], 'Order details')}
      loading={query.isLoading}
      error={query.error ? getErrorMessage(query.error) : null}
      action={
        <Button variant="contained" onClick={() => setOpen(true)}>
          Update status
        </Button>
      }
    >
      <RecordFields record={query.data} />
      <ConfirmDialog
        open={open}
        onClose={() => setOpen(false)}
        title="Update order status"
        content={
          <TextField select fullWidth label="Status" value={status} onChange={(e) => setStatus(e.target.value)} sx={{ mt: 1 }}>
            {['pending', 'processing', 'shipped', 'delivered', 'cancelled'].map((item) => (
              <MenuItem key={item} value={item}>
                {item}
              </MenuItem>
            ))}
          </TextField>
        }
        action={
          <Button variant="contained" disabled={!status || mutation.isPending} onClick={() => mutation.mutate()}>
            Update
          </Button>
        }
      />
    </DetailShell>
  );
}

export function DisputeDetailView() {
  const { id = '' } = useParams();
  const { showSnackbar } = useSnackbar();
  const [open, setOpen] = useState(false);
  const [resolution, setResolution] = useState('');
  const query = useQuery({ queryKey: ['admin-disputes'], queryFn: () => disputesApi.list({ limit: 100 }) });
  const record = (query.data?.items || []).find((item) => getRecordId(item) === id);
  const mutation = useMutation({
    mutationFn: () => disputesApi.update(id, { status: 'RESOLVED', resolution }),
    onSuccess: () => {
      showSnackbar('Dispute updated successfully', 'success');
      setOpen(false);
    },
    onError: (error) => showSnackbar(getErrorMessage(error), 'error'),
  });

  return (
    <DetailShell
      title="Dispute details"
      loading={query.isLoading}
      error={query.error ? getErrorMessage(query.error) : !record && !query.isLoading ? 'Dispute not found' : null}
      action={
        <Button variant="contained" onClick={() => setOpen(true)}>
          Resolve
        </Button>
      }
    >
      <RecordFields record={record} />
      <ConfirmDialog
        open={open}
        onClose={() => setOpen(false)}
        title="Resolve dispute"
        content={
          <TextField
            fullWidth
            multiline
            minRows={3}
            label="Resolution"
            value={resolution}
            onChange={(e) => setResolution(e.target.value)}
          />
        }
        action={
          <Button variant="contained" disabled={!resolution || mutation.isPending} onClick={() => mutation.mutate()}>
            Resolve
          </Button>
        }
      />
    </DetailShell>
  );
}

export function HospitalDetailView() {
  return <SimpleDetailView title="Hospital details" queryKey="hospital" fetcher={(id) => hospitalsApi.get(id)} />;
}

export function AmbulanceDetailView() {
  return <SimpleDetailView title="Ambulance booking" queryKey="ambulance" fetcher={(id) => ambulanceApi.get(id)} />;
}

export function DiagnosticDetailView() {
  return <SimpleDetailView title="Diagnostic booking" queryKey="diagnostic" fetcher={(id) => diagnosticsApi.getBooking(id)} />;
}

export function EmergencyDetailView() {
  return <SimpleDetailView title="Emergency request" queryKey="emergency" fetcher={(id) => emergencyApi.get(id)} />;
}

export function SupportDetailView() {
  const { id = '' } = useParams();
  const { showSnackbar } = useSnackbar();
  const [response, setResponse] = useState('');
  const query = useQuery({
    queryKey: ['support', id],
    queryFn: async () => asRecord((await supportApi.get(id)).data),
  });
  const mutation = useMutation({
    mutationFn: () => supportApi.update(id, { status: 'resolved', admin_response: response, response }),
    onSuccess: () => showSnackbar('Ticket updated successfully', 'success'),
    onError: (error) => showSnackbar(getErrorMessage(error), 'error'),
  });

  return (
    <DetailShell title="Support ticket" loading={query.isLoading} error={query.error ? getErrorMessage(query.error) : null}>
      <Stack spacing={3}>
        <RecordFields record={query.data} />
        <Card sx={{ p: 3 }}>
          <TextField
            fullWidth
            multiline
            minRows={3}
            label="Admin response"
            value={response}
            onChange={(e) => setResponse(e.target.value)}
          />
          <Button sx={{ mt: 2 }} variant="contained" disabled={mutation.isPending} onClick={() => mutation.mutate()}>
            Update ticket
          </Button>
        </Card>
      </Stack>
    </DetailShell>
  );
}

export function DoctorDetailView() {
  return <SimpleDetailView title="Doctor details" queryKey="doctor" fetcher={(id) => doctorsApi.get(id)} />;
}

export function HelpingHandDetailView() {
  const { id = '' } = useParams();
  const query = useQuery({
    queryKey: ['helping-hand', id],
    queryFn: async () => asRecord((await helpingHandsApi.get(id)).data),
  });
  const timelineQuery = useQuery({
    queryKey: ['helping-hand-timeline', id],
    queryFn: async () => asRecord((await helpingHandsApi.timeline(id)).data),
  });

  return (
    <DetailShell title="Helping hand details" loading={query.isLoading} error={query.error ? getErrorMessage(query.error) : null}>
      <Stack spacing={3}>
        <RecordFields record={query.data} />
        <RecordFields title="Timeline" record={timelineQuery.data} />
      </Stack>
    </DetailShell>
  );
}

export function WithdrawalDetailView() {
  return <SimpleDetailView title="Withdrawal details" queryKey="withdrawal" fetcher={(id) => withdrawalsApi.get(id)} />;
}

export function AppointmentDetailView() {
  return <SimpleDetailView title="Appointment details" queryKey="appointment" fetcher={(id) => appointmentsApi.get(id)} />;
}

export function MedicineFormView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();
  const [form, setForm] = useState({
    name: '',
    generic_name: '',
    manufacturer: '',
    category: '',
    description: '',
    strength: '',
    form: '',
    is_prescription_required: false,
  });
  const mutation = useMutation({
    mutationFn: () => (id ? medicinesApi.update(id, form) : medicinesApi.create(form)),
    onSuccess: () => {
      showSnackbar(id ? 'Medicine updated successfully' : 'Medicine created successfully', 'success');
      navigate('/medicines');
    },
    onError: (error) => showSnackbar(getErrorMessage(error), 'error'),
  });

  return (
    <DashboardContent maxWidth="sm">
      <PageHeader title={id ? 'Edit medicine' : 'Create medicine'} />
      <Card sx={{ p: 3 }}>
        <Stack spacing={2}>
          {Object.entries({
            name: 'Name',
            generic_name: 'Generic name',
            manufacturer: 'Manufacturer',
            category: 'Category',
            description: 'Description',
            strength: 'Strength',
            form: 'Form',
          }).map(([key, label]) => (
            <TextField
              key={key}
              required={key === 'name'}
              label={label}
              value={form[key as keyof typeof form]}
              onChange={(e) => setForm((prev) => ({ ...prev, [key]: e.target.value }))}
            />
          ))}
          <Stack direction="row" spacing={2}>
            <Button variant="outlined" onClick={() => navigate('/medicines')}>
              Cancel
            </Button>
            <Button variant="contained" disabled={mutation.isPending || !form.name} onClick={() => mutation.mutate()}>
              {mutation.isPending ? 'Saving...' : 'Save'}
            </Button>
          </Stack>
        </Stack>
      </Card>
    </DashboardContent>
  );
}

export function HospitalFormView() {
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [photo, setPhoto] = useState<File | null>(null);
  const [preview, setPreview] = useState('');
  const mutation = useMutation({
    mutationFn: () => {
      const form = new FormData();
      form.append('name', name);
      form.append('address', address);
      form.append('phone', phone);
      if (photo) form.append('photo', photo);
      return hospitalsApi.create(form);
    },
    onSuccess: () => {
      showSnackbar('Hospital created successfully', 'success');
      navigate('/hospitals');
    },
    onError: (error) => showSnackbar(getErrorMessage(error), 'error'),
  });

  return (
    <DashboardContent maxWidth="sm">
      <PageHeader title="Create hospital" />
      <Card sx={{ p: 3 }}>
        <Stack spacing={2}>
          <Button component="label" variant="outlined">
            Upload photo
            <input
              hidden
              type="file"
              accept="image/*"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (!file) return;
                if (file.size > 5 * 1024 * 1024) {
                  showSnackbar('File must be under 5MB', 'error');
                  return;
                }
                setPhoto(file);
                setPreview(URL.createObjectURL(file));
              }}
            />
          </Button>
          {preview && <Box component="img" src={preview} alt="Hospital preview" sx={{ width: 160, borderRadius: 1 }} />}
          <TextField required label="Name" value={name} onChange={(e) => setName(e.target.value)} />
          <TextField required label="Address" value={address} onChange={(e) => setAddress(e.target.value)} />
          <TextField required label="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
          <Stack direction="row" spacing={2}>
            <Button variant="outlined" onClick={() => navigate('/hospitals')}>
              Cancel
            </Button>
            <Button variant="contained" disabled={mutation.isPending || !name || !address || !phone} onClick={() => mutation.mutate()}>
              {mutation.isPending ? 'Saving...' : 'Create'}
            </Button>
          </Stack>
        </Stack>
      </Card>
    </DashboardContent>
  );
}
