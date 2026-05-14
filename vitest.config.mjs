import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  test: {
    environment: 'happy-dom',
    include: [
      'scripts/__tests__/**/*.test.mjs',
      'docs/.vitepress/theme/components/__tests__/**/*.spec.mjs'
    ],
    globals: true,
  }
})
