/* eslint-disable @typescript-eslint/no-unused-vars */
import react from '@vitejs/plugin-react-swc'
import { defineConfig } from 'vite'
import svgr from 'vite-plugin-svgr'
import path from 'path'

const getBase = (mode: string) => {
  switch (mode) {
    case 'github':
      return '/gh-api-tool/' // TODO: update to the real path
    case 'development':
    default:
      return '/'
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  return {
    plugins: [svgr(), react()],
    base: getBase(mode),
    resolve: {
      alias: {
        components: path.resolve(__dirname, './src/components'),
        constants: path.resolve(__dirname, './src/constants'),
        providers: path.resolve(__dirname, './src/providers'),
        services: path.resolve(__dirname, './src/services'),
        styles: path.resolve(__dirname, './src/styles'),
        assets: path.resolve(__dirname, './src/assets'),
        hooks: path.resolve(__dirname, './src/hooks'),
        utils: path.resolve(__dirname, './src/utils')
        // Add more aliases as needed
      }
    },
    server: {
      port: 3003,
      open: true,
      host: true,
      cors: true,
      historyApiFallback: true
    },
    build: {
      sourcemap: true,
      rollupOptions: {}
    }
  }
})
