import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';

import { useRouter } from 'src/routes/hooks';

import { LucideIcon } from 'src/components/lucide-icons';

// ----------------------------------------------------------------------

type BreadcrumbProps = {
  title: string;
  items?: {
    title: string;
    href?: string;
  }[];
};

export function Breadcrumb({ title, items = [] }: BreadcrumbProps) {
  const router = useRouter();

  const handleClick = (href?: string) => {
    if (href) {
      router.push(href);
    }
  };

  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="h4" sx={{ mb: 1 }}>
        {title}
      </Typography>
      
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        {items.map((item, index) => (
          <Box key={item.title} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {index > 0 && (
              <LucideIcon icon="eva:chevron-right-fill" sx={{ color: 'text.disabled' }} />
            )}
            {item.href ? (
              <Link
                component="button"
                variant="body2"
                color="text.primary"
                onClick={() => handleClick(item.href)}
                sx={{ 
                  textDecoration: 'none', 
                  fontWeight: 'fontWeightSemiBold',
                  '&:hover': { textDecoration: 'underline' } 
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
    </Box>
  );
}
