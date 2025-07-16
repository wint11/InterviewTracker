import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    port: 3002,
    open: false // 避免在 Electron 模式下自动打开浏览器
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    // 为Electron应用优化构建
    rollupOptions: {
      output: {
        // 确保资源路径正确
        assetFileNames: 'assets/[name].[hash].[ext]',
        chunkFileNames: 'assets/[name].[hash].js',
        entryFileNames: 'assets/[name].[hash].js'
      }
    }
  },
  base: './' // 使用相对路径，适合Electron应用
})