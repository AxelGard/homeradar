import { defineConfig } from 'vite';

export default defineConfig({
  base: '/homeradar/',
  resolve: {
    alias: {
      'react-bootstrap': 'react-bootstrap/cjs',
    },
  },
  esbuild: {
    logOverride: {
      'use client': 'silent',
    },
  },
});
