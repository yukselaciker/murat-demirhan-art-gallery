import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  // Uygulama alt dizinde ya da dosya:// altında açıldığında
  // statik dosya yollarının kırılmaması için relative base kullan
  base: './',
  plugins: [
    react(),
  ],
});
