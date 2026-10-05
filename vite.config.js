import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Gaushala Monitoring Portal',
        short_name: 'Gaushala',
        theme_color: '#ffffff',
        icons: []
      }
    })
  ],
  server: {
    port: 5173,
    host: true
  }
});
