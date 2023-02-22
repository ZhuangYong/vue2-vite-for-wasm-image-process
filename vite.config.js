import { defineConfig } from 'vite'
import { createVuePlugin as Vue2 } from 'vite-plugin-vue2'
import ScriptSetup from 'unplugin-vue2-script-setup/vite'
import eslintPlugin from '@nabla/vite-plugin-eslint'

export default defineConfig({
  plugins: [Vue2(), ScriptSetup(), eslintPlugin()]
})
