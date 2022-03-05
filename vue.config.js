const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
    transpileDependencies: true,
    css: {
        loaderOptions: {
            sass: {
                additionalData: '@import "@/styles/main.scss";' // Automatically imports the main.scss automatically to all components
            }
        }
    },
    pwa: {
        name: "YATZY",
        themeColor: "#1a1a1a"
    }
})
