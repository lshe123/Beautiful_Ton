import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000
  },
  build: {
    chunkSizeWarningLimit: 2000,
    // هذا السطر يخبر Vite و Vercel أن ملف index.html موجود في الجذر مباشرة
    rollupOptions: {
      input: './index.html'
    }
  }
});
