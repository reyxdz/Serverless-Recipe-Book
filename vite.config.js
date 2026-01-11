import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/Serverless-Recipe-Book/',
  plugins: [react()],
})
