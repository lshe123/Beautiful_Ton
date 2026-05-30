import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: './', // يضمن قراءة الروابط بشكل نسبي صحيح على استضافة Vercel
  build: {
    chunkSizeWarningLimit: 3000,
    outDir: 'dist'
  }
});
