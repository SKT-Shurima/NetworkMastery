import DefaultTheme from 'vitepress/theme'
import './custom.css'
import RoughDiagram from './components/RoughDiagram.vue'
import WideTable from './components/WideTable.vue'
import CyberpunkHome from './components/CyberpunkHome.vue'
import KnowledgeGraph from './components/KnowledgeGraph.vue'
import ConceptMap from './components/ConceptMap.vue'
import Icon from './components/Icon.vue'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('RoughDiagram', RoughDiagram)
    app.component('WideTable', WideTable)
    app.component('CyberpunkHome', CyberpunkHome)
    app.component('KnowledgeGraph', KnowledgeGraph)
    app.component('ConceptMap', ConceptMap)
    app.component('Icon', Icon)
  }
}
