import DefaultTheme from 'vitepress/theme'
import './custom.css'
import RoughDiagram from './components/RoughDiagram.vue'
import WideTable from './components/WideTable.vue'
import CyberpunkHome from './components/CyberpunkHome.vue'
import KnowledgeGraph from './components/KnowledgeGraph.vue'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('RoughDiagram', RoughDiagram)
    app.component('WideTable', WideTable)
    app.component('CyberpunkHome', CyberpunkHome)
    app.component('KnowledgeGraph', KnowledgeGraph)
  }
}
