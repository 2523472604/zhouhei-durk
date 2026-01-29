/*
 * @Author: 李家宝 2523472604@qq.com
 * @Date: 2026-01-29 09:06:29
 * @LastEditors: 李家宝 2523472604@qq.com
 * @LastEditTime: 2026-01-29 14:33:25
 * @FilePath: \zhouheiya\vite.config.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import { VantResolver } from '@vant/auto-import-resolver'

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [
    vue(),
    Components({
      resolvers: [VantResolver()],
    }),
  ],
})
