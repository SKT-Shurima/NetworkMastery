import { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import CyberLayout from './components/CyberLayout.vue'
import CyberHero from './components/CyberHero.vue'
import CyberFeatures from './components/CyberFeatures.vue'
import NetworkTopology from './components/NetworkTopology.vue'
import ExcalidrawDiagram from './components/ExcalidrawDiagram.vue'
import './styles/cyberpunk.css'

export default {
  extends: DefaultTheme,
  Layout: CyberLayout,
  enhanceApp({ app }) {
    // 注册全局组件
    app.component('CyberHero', CyberHero)
    app.component('CyberFeatures', CyberFeatures)
    app.component('NetworkTopology', NetworkTopology)
    app.component('ExcalidrawDiagram', ExcalidrawDiagram)
  }
} satisfies Theme
