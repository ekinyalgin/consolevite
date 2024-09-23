import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  return {
    base: mode === 'production' ? '/console/' : '/',  // Production ve Development ortamlarına göre base ayarı
    server: {
      port: 3000, // Development ortamında Vite için kullanılacak port
    },
    plugins: [react()],
  };
});