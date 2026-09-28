import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

// ----------------------------------------------------------------------

const PORT = 3039;

export default defineConfig({
  plugins: [
    react(),
  ],
  envPrefix: ['VITE_', 'NEXT_PUBLIC_'],
  resolve: {
    alias: [
      {
        find: /^src(.+)/,
        replacement: path.resolve(process.cwd(), 'src/$1'),
      },
    ],
  },
  optimizeDeps: {
    include: [
      '@mui/material/Tab',
      '@mui/material/Tabs',
      '@mui/material/Badge',
      '@mui/material/Dialog',
      '@mui/material/Tooltip',
      '@mui/material/InputAdornment',
      '@mui/material/LinearProgress',
      '@mui/material/CircularProgress',
      '@mui/material/ListItemButton',
    ],
  },
  server: { port: PORT, host: true },
  preview: { port: PORT, host: true },
});
