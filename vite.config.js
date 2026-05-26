import { defineConfig } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'
// https://vitejs.dev/config/
export default defineConfig({
  base: '/',
  server: {
    host: '127.0.0.1',
    port: 5174,
    strictPort: true,
  },
  plugins: [
    uni(),
  ],
  css: {
    preprocessorOptions: {
      scss: {
        silenceDeprecations: ['legacy-js-api', 'color-functions', 'import'],
      },
    },
  },
})
