import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  base: '/Stellairs/',
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'icons/*.png'],
      manifest: {
        name: 'BrainAtlas - 3D 大脑解剖',
        short_name: 'BrainAtlas',
        description: '交互式 3D 大脑解剖模型',
        theme_color: '#FAFBFC',
        background_color: '#FAFBFC',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/Stellairs/',
        start_url: '/Stellairs/',
        icons: [
          { src: '/Stellairs/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/Stellairs/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
        ],
      },
    }),
  ],
});
