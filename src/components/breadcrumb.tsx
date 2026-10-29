import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';

import { useRouter } from 'src/routes/hooks';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export type BreadcrumbItem = {
  title: string;
  href?: string;
};

type BreadcrumbProps = {
  title: string;
  items?: BreadcrumbItem[];
};

export function Breadcrumb({ title, items = [] }: BreadcrumbProps) {
  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="h4" sx={{ mb: 1 }}>
        {title}
      </Typography>

      <BreadcrumbTrail items={items} />
    </Box>
  );
}

export function BreadcrumbTrail({ items }: { items: BreadcrumbItem[] }) {
  const router = useRouter();

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
      {items.map((item, index) => (
        <Box key={item.title} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {index > 0 && <Iconify icon="solar:alt-arrow-right-linear" sx={{ color: 'text.disabled' }} />}
          {item.href ? (
            <Link
              component="button"
              variant="body2"
              color="text.primary"
              onClick={() => router.push(item.href!)}
              sx={{
                textDecoration: 'none',
                fontWeight: 'fontWeightSemiBold',
                '&:hover': { textDecoration: 'underline' },
              }}
            >
              {item.title}
            </Link>
          ) : (
            <Typography variant="body2" color="text.secondary">
              {item.title}
            </Typography>
          )}
        </Box>
      ))}
    </Box>
  );
}
