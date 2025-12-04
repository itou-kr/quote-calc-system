import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tsconfigPaths from 'vite-tsconfig-paths';

// export default defineConfig({
//   plugins: [react({ devTarget: 'es2023' }), tsconfigPaths()],
//   publicDir: './src/assets',
//   build: {
//     outDir: './dist',
//     chunkSizeWarningLimit: 1000,
//     rollupOptions: {
//       output: {
//         manualChunks: {
//           'vendor-react': ['react', 'react-dom', 'react-router-dom'],
//           'vendor-mui': [
//             '@emotion/react',
//             '@emotion/styled',
//             '@mui/base',
//             '@mui/icons-material',
//             '@mui/material',
//             '@mui/system',
//             '@mui/utils',
//             '@mui/x-data-grid',
//             '@mui/x-date-pickers',
//           ],
//         },
//       },
//     },
//   },
//   resolve: {
//     alias: {
//       '@mui/styled-engine': '@mui/styled-engine',
//     },
//   },
//   optimizeDeps: {
//     include: ['hoist-non-react-statics'],
//     exclude: [],
//   },
// });

export default defineConfig(() => {
  return {
    plugins: [react({ devTarget: 'es2023' }), tsconfigPaths()],
    publicDir: './src/assets',
    build: {
      outDir: './dist',
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        output: {
          manualChunks: {
            'vendor-react': ['react', 'react-dom', 'react-router-dom'],
            'vendor-mui': ['@emotion/react', '@emotion/styled', '@mui/base', '@mui/icons-material', '@mui/material', '@mui/system', '@mui/utils', '@mui/x-data-grid'],
          },
        },
      },
    },
    server: {
      proxy: {
        '/api': {
          target: 'http://localhost:3010',
        },
      },
    },
  };
});
