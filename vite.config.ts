import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue()],
    VitePWA({
        registerType: 'autoUpdate',
        manifest: {
            name: 'YATZY',
            theme_color: "#1a1a1a"
        }
    })
})
