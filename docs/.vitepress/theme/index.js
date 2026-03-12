import { h } from 'vue'
import Theme from 'vitepress/theme'
import './custom.css'

export default {
  extends: Theme,
  Layout: () => {
    return h(Theme.Layout, null, {
      // 可以在这里添加更多自定义布局
    })
  },
  enhanceApp({ app, router, siteData }) {
    // 应用增强
  }
}
