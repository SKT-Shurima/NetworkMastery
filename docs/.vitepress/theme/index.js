// NetworkMastery Cyberpunk Theme
import DefaultTheme from 'vitepress/theme'
import CyberpunkHome from './components/CyberpunkHome.vue'
import './style.css'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('CyberpunkHome', CyberpunkHome)
  }
}
