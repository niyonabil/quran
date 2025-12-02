import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '')

  console.log('🔧 Vite Environment Variables:')
  console.log('  VITE_SUPABASE_URL:', env.VITE_SUPABASE_URL ? '✓ Loaded' : '✗ Missing')
  console.log('  VITE_SUPABASE_ANON_KEY:', env.VITE_SUPABASE_ANON_KEY ? '✓ Loaded' : '✗ Missing')
  console.log('  VITE_API_URL:', env.VITE_API_URL ? '✓ Loaded' : '✗ Missing')

  return {
    plugins: [react()],
    server: {
      host: true,
      port: 5173
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    // Explicitly define env variables to ensure they're available
    define: {
      'import.meta.env.VITE_SUPABASE_URL': JSON.stringify(env.VITE_SUPABASE_URL),
      'import.meta.env.VITE_SUPABASE_ANON_KEY': JSON.stringify(env.VITE_SUPABASE_ANON_KEY),
      'import.meta.env.VITE_API_URL': JSON.stringify(env.VITE_API_URL),
    }
  }
})