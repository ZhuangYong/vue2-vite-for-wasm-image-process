import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import { createSvgIconsPlugin } from "vite-plugin-svg-icons"

export default defineConfig({
  plugins: [vue(), createSvgIconsPlugin({ symbolId: '[name]', iconDirs: [path.resolve(process.cwd(), 'src/assets/svg')] })],
  pwa: {
    iconPaths: {
      favicon32: 'favicon.ico',
      favicon16: 'favicon.ico',
      appleTouchIcon: 'favicon.ico',
      maskIcon: 'favicon.ico',
      msTileImage: 'favicon.ico'
    }
  },

  server:{
    host:"localhost",
    port:8080,
    hot:true,  // 自动更新
  },

  // 别名  @ => src
  resolve:{
    alias:{
      "@": path.resolve(__dirname,'src')
    }
  }
})
