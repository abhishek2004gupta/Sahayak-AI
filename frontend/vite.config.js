import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: [
      "@mapbox/node-pre-gyp",
      "mock-aws-s3",
      "aws-sdk",
      "@mswjs/interceptors",
      "nock"
    ]
  }
})

