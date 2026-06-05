import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Anything starting with /api is forwarded to the Express server.
      // Run `npm run dev` in /backend in a second terminal.
      '/api': {
        target: 'http://rate-my-peer-env.eba-c2fyxs4v.us-east-2.elasticbeanstalk.com/',
        changeOrigin: true,
      },
    },
  },
})
