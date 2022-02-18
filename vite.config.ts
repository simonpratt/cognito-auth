import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  root: './demo',
  build: {
    outDir: 'build',
  },
  plugins: [react()],
  // Workaround for AWS amplify
  resolve: {
    alias: [
      {
        find: './runtimeConfig',
        replacement: './runtimeConfig.browser',
      },
    ],
  },
});
