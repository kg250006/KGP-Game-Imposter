import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon_io/*.png', 'favicon_io/*.ico', 'CoverArt.png'],
      manifest: {
        name: 'The Imposter Game - Social Party Game',
        short_name: 'Imposter Game',
        description: 'Ultimate social deduction party game for 4-12 players. Perfect for game nights, parties, and gatherings. Free to play with premium features.',
        theme_color: '#E24E1B',
        background_color: '#0B0B0C',
        display: 'standalone',
        categories: ['games', 'entertainment', 'lifestyle'],
        start_url: '/',
        scope: '/',
        orientation: 'portrait',
        lang: 'en-US',
        dir: 'ltr',
        icons: [
          {
            src: '/favicon_io/android-chrome-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: '/favicon_io/android-chrome-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: '/favicon_io/android-chrome-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
        screenshots: [
          {
            src: '/CoverArt.png',
            sizes: '1200x630',
            type: 'image/png',
            label: 'The Imposter Game gameplay',
          }
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,json,svg,png,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365,
              },
            },
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
