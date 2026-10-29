import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';

import { DashboardContent } from 'src/layouts/dashboard';
import { Breadcrumb } from 'src/components/breadcrumb';
import { DetailSkeleton, ErrorState } from 'src/components/page-states';
import { useSnackbar } from 'src/components/snackbar';
import { hospitalsApi } from 'src/lib/api';
import { getErrorMessage, getRecordId, pickString } from 'src/lib/utils';
import { adminHospitalsService } from 'src/api/admin-services';

import { HospitalForm, EMPTY_HOSPITAL_FORM, type HospitalFormValues } from './new-hospital-view';

function field(record: Record<string, unknown>, key: string) {
  const value = pickString(record, [key], '');
  return value === '—' ? '' : value;
}

export function HospitalEditView() {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();

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

  const initialValues = useMemo<HospitalFormValues>(() => {
    if (!query.data) return EMPTY_HOSPITAL_FORM;
    const record = query.data as Record<string, unknown>;
    return {
      name: field(record, 'name'),
      address: field(record, 'address'),
      phone: field(record, 'phone'),
      email: field(record, 'email'),
      city: field(record, 'city'),
      district: field(record, 'district'),
      type: field(record, 'type'),
      details: field(record, 'details'),
      location_lat: field(record, 'location_lat'),
      location_long: field(record, 'location_long'),
    };
  }, [query.data]);

  const existingPhoto = query.data
    ? field(query.data as Record<string, unknown>, 'photo') || null
    : null;

  const mutation = useMutation({
    mutationFn: ({ values, photo }: { values: HospitalFormValues; photo: File | null }) =>
      adminHospitalsService.updateHospital(id, { ...values, photo: photo || undefined }),
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
          { title: initialValues.name || 'Edit Hospital' },
        ]}
      />

      {query.isLoading ? (
        <DetailSkeleton />
      ) : query.error || !query.data ? (
        <ErrorState
          message={query.error ? getErrorMessage(query.error) : 'Hospital not found'}
          onRetry={() => query.refetch()}
        />
      ) : (
        <HospitalForm
          initialValues={initialValues}
          existingPhotoUrl={existingPhoto}
          submitting={mutation.isPending}
          submitLabel="Save changes"
          submittingLabel="Saving…"
          summaryTitle="Save your changes"
          summaryText="Updates are visible to families as soon as you save."
          secondaryAction={{ label: 'Cancel', icon: 'solar:close-circle-bold', onClick: () => navigate('/hospitals') }}
          onSubmit={async (values, photo) => {
            await mutation.mutateAsync({ values, photo }).catch(() => undefined);
          }}
        />
      )}
    </DashboardContent>
  );
}
