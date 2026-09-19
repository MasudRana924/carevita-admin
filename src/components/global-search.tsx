import { useQuery } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import TextField from '@mui/material/TextField';

import { bookingsApi, caregiversApi, hospitalsApi, usersApi } from 'src/lib/api';
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
  const caregiversQuery = useQuery({
    queryKey: ['global-search', 'caregivers', input],
    queryFn: () => caregiversApi.list({ limit: 20, page: 1 }),
    enabled,
  });
  const bookingsQuery = useQuery({
    queryKey: ['global-search', 'bookings', input],
    queryFn: () => bookingsApi.list({ limit: 20, page: 1 }),
    enabled,
  });
  const hospitalsQuery = useQuery({
    queryKey: ['global-search', 'hospitals', input],
    queryFn: () => hospitalsApi.list({ limit: 20, page: 1 }),
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
    push(caregiversQuery.data?.items || [], 'Caregivers', '/caregivers', ['name', 'email', 'phone']);
    push(bookingsQuery.data?.items || [], 'Bookings', '/bookings', ['booking_number', 'customer_name', 'id']);
    push(hospitalsQuery.data?.items || [], 'Hospitals', '/hospitals', ['name', 'district', 'phone']);

    return hits.slice(0, 20);
  }, [input, usersQuery.data, caregiversQuery.data, bookingsQuery.data, hospitalsQuery.data]);

  const loading =
    enabled &&
    (usersQuery.isFetching ||
      caregiversQuery.isFetching ||
      bookingsQuery.isFetching ||
      hospitalsQuery.isFetching);

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
