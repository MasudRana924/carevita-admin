import { useEffect, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import FormControlLabel from '@mui/material/FormControlLabel';

import { Iconify } from 'src/components/iconify';
import { PremiumSwitch } from 'src/components/detail-ui';
import { useSnackbar } from 'src/components/snackbar';
import { servicePackagesApi } from 'src/lib/api';
import { getErrorMessage, pickNumber, pickString } from 'src/lib/utils';

// ----------------------------------------------------------------------

type Props = {
  open: boolean;
  packageRow: Record<string, unknown> | null;
  onClose: () => void;
};

export function PackageEditDrawer({ open, packageRow, onClose }: Props) {
  const { showSnackbar } = useSnackbar();
  const queryClient = useQueryClient();

  const [label, setLabel] = useState('');
  const [description, setDescription] = useState('');
  const [basePrice, setBasePrice] = useState('');
  const [sortOrder, setSortOrder] = useState('');
  const [isActive, setIsActive] = useState(true);

  const code = pickString(packageRow, ['code'], '');

  useEffect(() => {
    if (!packageRow) return;
    setLabel(pickString(packageRow, ['label'], '') === '—' ? '' : pickString(packageRow, ['label'], ''));
    const desc = pickString(packageRow, ['description'], '');
    setDescription(desc === '—' ? '' : desc);
    const price = pickNumber(packageRow, ['base_price']);
    setBasePrice(price != null ? String(price) : '');
    const order = pickNumber(packageRow, ['sort_order']);
    setSortOrder(order != null ? String(order) : '0');
    setIsActive(packageRow.is_active !== false);
  }, [packageRow]);

  const mutation = useMutation({
    mutationFn: () => {
      const price = Number(basePrice);
      if (Number.isNaN(price) || price < 0) {
        throw new Error('Base price must be a valid non-negative number');
      }
      const order = Number(sortOrder);
      if (Number.isNaN(order)) {
        throw new Error('Sort order must be a number');
      }
      return servicePackagesApi.update(code, {
        label: label.trim(),
        description: description.trim(),
        base_price: price,
        sort_order: order,
        is_active: isActive,
      });
    },
    onSuccess: () => {
      showSnackbar('Package updated', 'success');
      queryClient.invalidateQueries({ queryKey: ['admin-service-packages'] });
      queryClient.invalidateQueries({ queryKey: ['services-catalog'] });
      onClose();
    },
    onError: (error) => showSnackbar(getErrorMessage(error), 'error'),
  });

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={() => !mutation.isPending && onClose()}
      slotProps={{ paper: { sx: { width: { xs: '100%', sm: 420 } } } }}
    >
      <Stack spacing={2.5} sx={{ p: 3, height: '100%' }}>
        <Stack direction="row" alignItems="flex-start" justifyContent="space-between" spacing={2}>
          <Box>
            <Typography variant="h6">Edit package</Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', fontFamily: 'monospace' }}>
              {code || '—'}
            </Typography>
          </Box>
          <Button
            size="small"
            color="inherit"
            onClick={onClose}
            disabled={mutation.isPending}
            startIcon={<Iconify icon="solar:close-circle-bold" />}
          >
            Close
          </Button>
        </Stack>

        <Divider />

        <TextField
          fullWidth
          label="Label"
          value={label}
          onChange={(event) => setLabel(event.target.value)}
        />
        <TextField
          fullWidth
          multiline
          minRows={3}
          label="Description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
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
        <FormControlLabel
          control={
            <PremiumSwitch checked={isActive} onChange={(_event, checked) => setIsActive(checked)} />
          }
          label={isActive ? 'Active' : 'Inactive'}
          sx={{ ml: 0, gap: 1.5 }}
        />

        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          Final user price = base_price + caregiver_hourly_rate × duration_hours + platform fee
        </Typography>

        <Box sx={{ flexGrow: 1 }} />

        <Button
          fullWidth
          size="large"
          variant="contained"
          disabled={mutation.isPending || !label.trim()}
          startIcon={
            mutation.isPending ? <CircularProgress size={16} color="inherit" /> : <Iconify icon="solar:check-circle-bold" />
          }
          onClick={() => mutation.mutate()}
        >
          Save changes
        </Button>
      </Stack>
    </Drawer>
  );
}
