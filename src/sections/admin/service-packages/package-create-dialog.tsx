import { useEffect, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import CircularProgress from '@mui/material/CircularProgress';
import FormControlLabel from '@mui/material/FormControlLabel';

import { Iconify } from 'src/components/iconify';
import { PremiumSwitch } from 'src/components/detail-ui';
import { useSnackbar } from 'src/components/snackbar';
import { servicePackagesApi } from 'src/lib/api';
import { getErrorMessage } from 'src/lib/utils';

import { HOME_PACKAGE_CODES, OUTDOOR_PACKAGE_CODES, SERVICE_TYPES } from './package-constants';

// ----------------------------------------------------------------------

type Props = {
  open: boolean;
  defaultServiceType?: string;
  onClose: () => void;
};

export function PackageCreateDialog({ open, defaultServiceType = 'HOME_CARE', onClose }: Props) {
  const { showSnackbar } = useSnackbar();
  const queryClient = useQueryClient();

  const [serviceType, setServiceType] = useState(defaultServiceType);
  const [code, setCode] = useState('');
  const [label, setLabel] = useState('');
  const [description, setDescription] = useState('');
  const [durationHours, setDurationHours] = useState('6');
  const [basePrice, setBasePrice] = useState('');
  const [sortOrder, setSortOrder] = useState('10');
  const [isActive, setIsActive] = useState(true);

  const codeOptions = serviceType === 'HOSPITAL_ASSISTANCE' ? OUTDOOR_PACKAGE_CODES : HOME_PACKAGE_CODES;

  const reset = (nextType = defaultServiceType) => {
    setServiceType(nextType);
    setCode('');
    setLabel('');
    setDescription('');
    setDurationHours(nextType === 'HOSPITAL_ASSISTANCE' ? '2' : '6');
    setBasePrice('');
    setSortOrder('10');
    setIsActive(true);
  };

  const mutation = useMutation({
    mutationFn: () => {
      const price = Number(basePrice);
      const hours = Number(durationHours);
      const order = Number(sortOrder);
      if (!code.trim()) throw new Error('Package code is required');
      if (!label.trim()) throw new Error('Label is required');
      if (Number.isNaN(price) || price < 0) throw new Error('Base price must be a valid non-negative number');
      if (Number.isNaN(hours) || hours <= 0) throw new Error('Duration hours must be greater than 0');
      if (Number.isNaN(order)) throw new Error('Sort order must be a number');

      return servicePackagesApi.create({
        code: code.trim().toUpperCase(),
        service_type: serviceType,
        duration_hours: hours,
        base_price: price,
        label: label.trim(),
        description: description.trim(),
        is_active: isActive,
        sort_order: order,
      });
    },
    onSuccess: () => {
      showSnackbar('Package saved', 'success');
      queryClient.invalidateQueries({ queryKey: ['admin-service-packages'] });
      queryClient.invalidateQueries({ queryKey: ['services-catalog'] });
      reset();
      onClose();
    },
    onError: (error) => showSnackbar(getErrorMessage(error), 'error'),
  });

  useEffect(() => {
    if (open) reset(defaultServiceType);
    // reset form when dialog opens
  }, [open, defaultServiceType]);

  const handleClose = () => {
    if (mutation.isPending) return;
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>Create / upsert package</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ pt: 1 }}>
          <TextField
            select
            fullWidth
            label="Service type"
            value={serviceType}
            onChange={(event) => {
              const next = event.target.value;
              setServiceType(next);
              setCode('');
              setDurationHours(next === 'HOSPITAL_ASSISTANCE' ? '2' : '6');
            }}
          >
            {SERVICE_TYPES.map((item) => (
              <MenuItem key={item.value} value={item.value}>
                {item.label}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            fullWidth
            label="Code"
            value={code}
            onChange={(event) => {
              const next = event.target.value;
              setCode(next);
              const match = codeOptions.find((item) => item.code === next);
              if (match) {
                setDurationHours(String(match.hours));
                if (!label.trim()) setLabel(match.label);
              }
            }}
          >
            {codeOptions.map((item) => (
              <MenuItem key={item.code} value={item.code}>
                {item.code} ({item.hours}h)
              </MenuItem>
            ))}
          </TextField>

          <TextField
            fullWidth
            label="Label"
            value={label}
            onChange={(event) => setLabel(event.target.value)}
          />
          <TextField
            fullWidth
            multiline
            minRows={2}
            label="Description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField
              fullWidth
              label="Duration (hours)"
              type="number"
              value={durationHours}
              onChange={(event) => setDurationHours(event.target.value)}
              slotProps={{ htmlInput: { min: 1, step: 1 } }}
            />
            <TextField
              fullWidth
              label="Base price (৳)"
              type="number"
              value={basePrice}
              onChange={(event) => setBasePrice(event.target.value)}
              slotProps={{ htmlInput: { min: 0, step: 1 } }}
            />
            <TextField
              fullWidth
              label="Sort order"
              type="number"
              value={sortOrder}
              onChange={(event) => setSortOrder(event.target.value)}
            />
          </Stack>
          <FormControlLabel
            control={
              <PremiumSwitch checked={isActive} onChange={(_event, checked) => setIsActive(checked)} />
            }
            label={isActive ? 'Active' : 'Inactive'}
            sx={{ ml: 0, gap: 1.5 }}
          />
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2.5 }}>
        <Button color="inherit" onClick={handleClose} disabled={mutation.isPending}>
          Cancel
        </Button>
        <Button
          variant="contained"
          disabled={mutation.isPending}
          startIcon={
            mutation.isPending ? (
              <CircularProgress size={16} color="inherit" />
            ) : (
              <Iconify icon="solar:add-circle-bold" />
            )
          }
          onClick={() => mutation.mutate()}
        >
          Save package
        </Button>
      </DialogActions>
    </Dialog>
  );
}
