import tailwind from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';

import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react(), tailwind()],
  optimizeDeps: {
    // 这些包由本地构建产物提供，避免 Vite 预打包扫描时误处理
    exclude: ['@ikun-kit/react-granule'],
  },
});
