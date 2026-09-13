import { useQuery } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import TextField from '@mui/material/TextField';

import { bookingsApi, ordersApi, paymentsApi, providersApi, usersApi } from 'src/lib/api';
import { pickString } from 'src/lib/utils';

type SearchHit = {
  id: string;
  label: string;
  path: string;
  group: string;
};

export function GlobalSearch() {
  const navigate = useNavigate();
  const [input, setInput] = useState('');
  const enabled = input.trim().length >= 2;

  const usersQuery = useQuery({
    queryKey: ['global-search', 'users', input],
    queryFn: () => usersApi.list({ limit: 20, page: 1 }),
    enabled,
  });
  const providersQuery = useQuery({
    queryKey: ['global-search', 'providers', input],
    queryFn: () => providersApi.list({ limit: 20, page: 1 }),
    enabled,
  });
  const bookingsQuery = useQuery({
    queryKey: ['global-search', 'bookings', input],
    queryFn: () => bookingsApi.list({ limit: 20, page: 1 }),
    enabled,
  });
  const paymentsQuery = useQuery({
    queryKey: ['global-search', 'payments', input],
    queryFn: () => paymentsApi.list({ limit: 20, page: 1 }),
    enabled,
  });
  const ordersQuery = useQuery({
    queryKey: ['global-search', 'orders', input],
    queryFn: () => ordersApi.list({ limit: 20, page: 1 }),
    enabled,
  });

  const options = useMemo(() => {
    const q = input.toLowerCase();
    const hits: SearchHit[] = [];

    const push = (
      items: Record<string, unknown>[],
      group: string,
      pathPrefix: string,
      keys: string[]
    ) => {
      items.forEach((item) => {
        const id = pickString(item, ['id', '_id'], '');
        const label = pickString(item, keys, id);
        const haystack = `${label} ${JSON.stringify(item)}`.toLowerCase();
        if (id && haystack.includes(q)) {
          hits.push({ id, label: `${label}`, path: `${pathPrefix}/${id}`, group });
        }
      });
    };

    push(usersQuery.data?.items || [], 'Users', '/users', ['name', 'email', 'phone']);
    push(providersQuery.data?.items || [], 'Providers', '/providers', ['name', 'email', 'phone']);
    push(bookingsQuery.data?.items || [], 'Bookings', '/bookings', ['booking_number', 'customer_name', 'id']);
    push(paymentsQuery.data?.items || [], 'Payments', '/payments', ['id', 'transaction_id']);
    push(ordersQuery.data?.items || [], 'Orders', '/orders', ['order_number', 'customer_name', 'id']);

    return hits.slice(0, 20);
  }, [input, usersQuery.data, providersQuery.data, bookingsQuery.data, paymentsQuery.data, ordersQuery.data]);

  const loading =
    enabled &&
    (usersQuery.isFetching ||
      providersQuery.isFetching ||
      bookingsQuery.isFetching ||
      paymentsQuery.isFetching ||
      ordersQuery.isFetching);

  return (
    <Autocomplete
      sx={{ minWidth: { xs: 160, md: 280 } }}
      options={options}
      loading={loading}
      inputValue={input}
      onInputChange={(_, value) => setInput(value)}
      getOptionLabel={(option) => option.label}
      groupBy={(option) => option.group}
      filterOptions={(x) => x}
      noOptionsText={enabled ? 'No matches' : 'Type to search'}
      onChange={(_, value) => {
        if (value) navigate(value.path);
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          size="small"
          placeholder="Search admin data"
          slotProps={{
            input: {
              ...params.InputProps,
              endAdornment: (
                <>
                  {loading ? <CircularProgress color="inherit" size={16} /> : null}
                  {params.InputProps.endAdornment}
                </>
              ),
            },
          }}
        />
      )}
      renderOption={(props, option) => (
        <Box component="li" {...props} key={`${option.group}-${option.id}`}>
          {option.label}
        </Box>
      )}
    />
  );
}
