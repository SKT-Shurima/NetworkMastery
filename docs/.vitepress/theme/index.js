import Theme from 'vitepress/theme'
import './custom.css'
import RoughDiagram from './components/RoughDiagram.vue'
import WideTable from './components/WideTable.vue'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    // 注册全局组件
    app.component('RoughDiagram', RoughDiagram)
    app.component('WideTable', WideTable)
  }
}
