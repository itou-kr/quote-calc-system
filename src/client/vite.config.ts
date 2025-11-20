import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [react({ devTarget: 'es2023' }), tsconfigPaths()],
  publicDir: './src/assets',
  build: {
    outDir: './dist',
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Split vendor chunks more granularly for better caching
          if (id.includes('node_modules')) {
            // React core libraries
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
              return 'vendor-react';
            }
            // MUI Core
            if (id.includes('@mui/material') || id.includes('@mui/system')) {
              return 'vendor-mui-core';
            }
            // MUI Icons
            if (id.includes('@mui/icons-material')) {
              return 'vendor-mui-icons';
            }
            // MUI Data Grid and Date Pickers (large components)
            if (id.includes('@mui/x-data-grid')) {
              return 'vendor-mui-datagrid';
            }
            if (id.includes('@mui/x-date-pickers')) {
              return 'vendor-mui-datepicker';
            }
            // Emotion styling
            if (id.includes('@emotion')) {
              return 'vendor-emotion';
            }
            // Redux
            if (id.includes('redux') || id.includes('@reduxjs')) {
              return 'vendor-redux';
            }
            // React Query
            if (id.includes('@tanstack/react-query')) {
              return 'vendor-react-query';
            }
            // i18next
            if (id.includes('i18next')) {
              return 'vendor-i18n';
            }
            // Form libraries
            if (id.includes('react-hook-form') || id.includes('yup')) {
              return 'vendor-forms';
            }
            // Other vendor libraries
            return 'vendor-other';
          }
        },
      },
    },
  },
  resolve: {
    alias: {
      '@mui/styled-engine': '@mui/styled-engine',
    },
  },
  optimizeDeps: {
    include: ['hoist-non-react-statics', 'react', 'react-dom', 'react-router-dom'],
    exclude: [],
  },
});
