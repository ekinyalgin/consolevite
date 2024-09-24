import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  return {
    server: {
      port: 3000, // Development ortamında Vite için kullanılacak port
    },
    plugins: [react()],
  };
});