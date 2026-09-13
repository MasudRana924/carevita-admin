import Box from '@mui/material/Box';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';

import { LucideIcon } from 'src/components/lucide-icons';

// ----------------------------------------------------------------------

type TableNoDataProps = {
  searchQuery?: string;
  onClearFilters?: () => void;
  colSpan?: number;
};

export function TableNoData({ searchQuery, onClearFilters, colSpan = 9 }: TableNoDataProps) {
  return (
    <TableRow>
      <TableCell colSpan={colSpan} sx={{ py: 10 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 3,
            textAlign: 'center',
            position: 'relative',
          }}
        >
          {/* Beautiful Icon */}
          <Box
            sx={{
              width: 120,
              height: 120,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: (theme) => `linear-gradient(135deg, ${theme.palette.primary.lighter} 0%, ${theme.palette.primary.light} 100%)`,
              boxShadow: (theme) => `0 8px 32px ${theme.palette.primary.main}20`,
              mb: 2,
            }}
          >
            <LucideIcon 
              icon="eva:search-fill" 
              sx={{ 
                width: 48, 
                height: 48, 
                color: 'primary.main',
                opacity: 0.8,
              }} 
            />
          </Box>

          {/* Main Title */}
          <Typography 
            variant="h4" 
            sx={{ 
              color: 'text.primary',
              fontWeight: 700,
              mb: 1,
            }}
          >
            No Data Found
          </Typography>

          {/* Subtitle */}
          <Typography 
            variant="body1" 
            sx={{ 
              color: 'text.secondary',
              maxWidth: 400,
              lineHeight: 1.6,
            }}
          >
            {searchQuery ? (
              <>
                We couldn&apos;t find any results for &nbsp;
                <Box
                  component="span"
                  sx={{
                    color: 'primary.main',
                    fontWeight: 600,
                    backgroundColor: 'primary.lighter',
                    px: 1,
                    py: 0.5,
                    borderRadius: 1,
                    display: 'inline-block',
                  }}
                >
                  "{searchQuery}"
                </Box>
                <br />
                Try adjusting your search terms or clearing the filters.
              </>
            ) : (
              "There are no items to display at the moment. Check back later or try adding some new items."
            )}
          </Typography>

          {/* Action Button */}
          {onClearFilters && (
            <Box
              component="button"
              onClick={onClearFilters}
              sx={{
                mt: 2,
                px: 3,
                py: 1.5,
                borderRadius: 2,
                border: 'none',
                background: (theme) => `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                color: 'white',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: (theme) => `0 8px 25px ${theme.palette.primary.main}40`,
                },
              }}
            >
              Clear Filters
            </Box>
          )}

          {/* Decorative Elements */}
          <Box
            sx={{
              position: 'absolute',
              top: '20%',
              left: '10%',
              width: 60,
              height: 60,
              borderRadius: '50%',
              background: (theme) => `linear-gradient(45deg, ${theme.palette.secondary.light}20, ${theme.palette.secondary.main}20)`,
              animation: 'float 6s ease-in-out infinite',
              '@keyframes float': {
                '0%, 100%': {
                  transform: 'translateY(0px) rotate(0deg)',
                },
                '50%': {
                  transform: 'translateY(-20px) rotate(180deg)',
                },
              },
            }}
          />
          
          <Box
            sx={{
              position: 'absolute',
              bottom: '20%',
              right: '10%',
              width: 40,
              height: 40,
              borderRadius: '50%',
              background: (theme) => `linear-gradient(45deg, ${theme.palette.info.light}20, ${theme.palette.info.main}20)`,
              animation: 'float 8s ease-in-out infinite reverse',
              '@keyframes float': {
                '0%, 100%': {
                  transform: 'translateY(0px) rotate(0deg)',
                },
                '50%': {
                  transform: 'translateY(-15px) rotate(-180deg)',
                },
              },
            }}
          />
        </Box>
      </TableCell>
    </TableRow>
  );
}
