// NetworkMastery Cyberpunk Theme
import DefaultTheme from 'vitepress/theme'
import CyberpunkHome from './components/CyberpunkHome.vue'
import ThinkingQuestion from './components/ThinkingQuestion.vue'
import ExcalidrawViewer from './components/ExcalidrawViewer.vue'
import VisNetworkViewer from './components/VisNetworkViewer.vue'
import './style.css'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('CyberpunkHome', CyberpunkHome)
    app.component('ThinkingQuestion', ThinkingQuestion)
    app.component('ExcalidrawViewer', ExcalidrawViewer)
    app.component('VisNetworkViewer', VisNetworkViewer)
  }
}
