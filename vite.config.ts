import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  base: '/career-canvas-ai-sculptor-97/',

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
    server: {
    allowedHosts: [
      'written-use-georgia-purchases.trycloudflare.com' // ✅ add this line
      ,'beta-card-pod-corruption.trycloudflare.com'
      ,'individually-settled-constitutional-flashing.trycloudflare.com'
    ],
  },

});
