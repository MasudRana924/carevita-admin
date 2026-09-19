import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

import { getErrorMessage } from 'src/lib/utils';

type ListResult<T> = {
  items: T[];
  meta?: Record<string, unknown>;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
};

export function useDebouncedValue<T>(value: T, delay = 400) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}

export function useResourceList<T>(
  key: string,
  fetcher: (params: Record<string, string | number | boolean | undefined>) => Promise<ListResult<T>>,
  extraParams: Record<string, string | number | boolean | undefined> = {}
) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<Record<string, string>>({});

  const query = useQuery({
    queryKey: [key, page, rowsPerPage, filters, extraParams],
    queryFn: () =>
      fetcher({
        page: page + 1,
        limit: rowsPerPage,
        ...filters,
        ...extraParams,
      }),
  });

  const setFilter = (id: string, value: string) => {
    setPage(0);
    setFilters((prev) => ({ ...prev, [id]: value }));
  };

  const items = query.data?.items || [];
  const pagination = query.data?.pagination;
  const total = Number(pagination?.total) || 0;
  const hasNextPage = pagination?.hasNext ?? items.length >= rowsPerPage;

  return {
    ...query,
    items,
    page,
    setPage,
    rowsPerPage,
    setRowsPerPage: (value: number) => {
      setPage(0);
      setRowsPerPage(value);
    },
    search,
    setSearch,
    filters,
    setFilter,
    hasNextPage,
    totalCount: total,
    errorMessage: query.error ? getErrorMessage(query.error) : null,
  };
}
