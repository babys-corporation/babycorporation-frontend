import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import { VitePWA } from 'vite-plugin-pwa' // 1. Adicionamos o import do plugin aqui

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    // 2. Adicionamos o VitePWA dentro da lista de plugins
    VitePWA({
      registerType: 'autoUpdate', // Atualiza automaticamente quando tiver nova versão
      workbox: {
        // Define quais arquivos devem ser baixados para funcionar offline
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        cleanupOutdatedCaches: true,
      },
      manifest: {
        name: 'BabyCorporation', // Nome completo que aparece na tela de instalação
        short_name: 'BabyCorporation', // Nome curtinho que fica embaixo do ícone no celular
        description: 'Aplicativo para encontrar e agendar babás de confiança',
        theme_color: '#FFFFFF', // Cor da barra de cima
        background_color: '#FBF3FB', // Cor de fundo na tela de carregamento
        display: 'standalone', // Faz parecer um app nativo, sem a barra do navegador
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: '/icons/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/icons/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: '/icons/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable' // Permite que o celular recorte o ícone bonitinho
          }
        ]
      }
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
})