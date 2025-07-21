import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Chuyển tất cả các yêu cầu bắt đầu bằng /api đến server backend
      '/api': {
        target: 'http://localhost:3000', // Địa chỉ backend khi chạy ở máy
        changeOrigin: true,
      },
    },
  },
})