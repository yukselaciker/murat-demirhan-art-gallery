import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load env variables
  const env = loadEnv(mode, process.cwd(), '');

  return {
    // Uygulama alt dizinde ya da dosya:// altında açıldığında
    // statik dosya yollarının kırılmaması için relative base kullan
    base: './',
    plugins: [
      react(),
      // Inject Supabase env vars into HTML for direct client queries
      {
        name: 'html-transform',
        transformIndexHtml(html) {
          return html
            .replace('%VITE_SUPABASE_URL%', env.VITE_SUPABASE_URL || '')
            .replace('%VITE_SUPABASE_ANON_KEY%', env.VITE_SUPABASE_ANON_KEY || '');
        }
      }
    ],
  };
});

