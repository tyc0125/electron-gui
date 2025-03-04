import path from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()],
    define: {
      'process.env.VITE_CURRENT_RUN_MODE': JSON.stringify('main'),
      'import.meta.env.VITE_CURRENT_RUN_MODE': JSON.stringify('main')
    }
  },
  preload: {
    plugins: [externalizeDepsPlugin()],
    define: {
      'process.env.VITE_CURRENT_RUN_MODE': JSON.stringify('preload'),
      'import.meta.env.VITE_CURRENT_RUN_MODE': JSON.stringify('preload')
    }
  },
  renderer: {
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src')
      }
    },
    plugins: [vue()],
    define: {
      'process.env.VITE_CURRENT_RUN_MODE': JSON.stringify('renderer'),
      'import.meta.env.VITE_CURRENT_RUN_MODE': JSON.stringify('renderer')
    }
  }
})
