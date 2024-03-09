import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

import path from 'path'
// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  return {
    // 项目插件
    plugins: [
      vue(),
    ],
    // 基础配置
    base: './',
    publicDir: 'public',
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
    css: {
      preprocessorOptions: {
        less: {
          modifyVars: {
            '@border-color-base': '#dce3e8',
          },
          javascriptEnabled: true,
        },
      },
    },
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      assetsInlineLimit: 4096,
      cssCodeSplit: true,
      brotliSize: false,
      sourcemap: false,
      minify: 'terser',
      terserOptions: {
        compress: {
          // 生产环境去除console及debug
          drop_console: false,
          drop_debugger: true,
        },
      },
    },
    server: {
      proxy: {
        // 代理路径
        '/api': {
          // 目标地址
          target: 'https://magicbox.santannew.top',
          // 是否改变请求的源地址，这里设置为 true，表示强制使用绝对路径
          changeOrigin: true,
          // 路径重写规则，这里将 /api 开头的请求路径替换为空字符串，即去掉 /api 前缀
          rewrite: (path) => path.replace(/^\/api/, '/api')
        }
      }
    },
  }
})


