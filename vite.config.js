import { defineConfig } from 'vite'
// import crossOriginIsolation from 'vite-plugin-cross-origin-isolation'
import { createVuePlugin as Vue2 } from 'vite-plugin-vue2'
import ScriptSetup from 'unplugin-vue2-script-setup/vite'
import eslintPlugin from '@nabla/vite-plugin-eslint'

const crossOriginIsolation = () => ({
  name: 'configure-server',

  configureServer(server) {
    server.middlewares.use((_req, res, next) => {
      res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
      res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
      next();
    });
  }

});

export default defineConfig({
  assetsInclude: 'static',
  server: { host:'0.0.0.0', port:9000 },
  plugins: [crossOriginIsolation(), Vue2(), ScriptSetup(), eslintPlugin()]
})
