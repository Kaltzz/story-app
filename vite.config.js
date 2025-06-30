import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  // Tidak perlu 'root' atau 'publicDir' lagi, Vite akan menanganinya secara otomatis
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
  plugins: [
    VitePWA({
      strategies: 'generateSW',
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,jpg,jpeg}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/story-api\.dicoding\.dev\//,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 72 * 60 * 60, // 3 hari
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
            src: 'icons/icon-72x72.png', // Path ini sekarang sudah benar
            sizes: '72x72',
            type: 'image/png',
          },
          {
            src: 'icons/icon-512x512.png', // Path ini sekarang sudah benar
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
      devOptions: {
        enabled: false,
      },
    }),
  ],
});