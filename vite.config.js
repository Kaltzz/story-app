import { defineConfig } from 'vite';
import { resolve } from 'path';
import { VitePWA } from 'vite-plugin-pwa';
import dns from 'dns';

// Untuk mengatasi masalah WebSocket di localhost
dns.setDefaultResultOrder('verbatim');

export default defineConfig({
  root: resolve(__dirname, 'src'),
  publicDir: resolve(__dirname, 'src', 'public'),
  build: {
    outDir: resolve(__dirname, 'dist'),
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  base: '/',  // Ubah ini dari '/story-app/' menjadi '/'
  server: {
    // Konfigurasi untuk WebSocket
    host: true, // Mengizinkan akses dari network
    hmr: {
      protocol: 'ws',
      host: 'localhost',
      port: 5173,
      clientPort: 5173 // Tambahkan ini untuk memastikan client menggunakan port yang sama
    }
  },
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,jpg}'],
        runtimeCaching: [
          {
            urlPattern: new RegExp('^https://story-api\\.dicoding\\.dev/'),
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 72 * 60 * 60, // 72 jam
              },
            },
          },
        ],
      },
      manifest: {
        name: 'Story Explorer',
        short_name: 'StoryApp',
        description: 'Story Explorer Application',
        theme_color: '#ffffff',
        icons: [
          {
            src: 'favicon.png',
            sizes: '192x192',
            type: 'image/png',
          },
        ],
      },
    }),
  ],
});
