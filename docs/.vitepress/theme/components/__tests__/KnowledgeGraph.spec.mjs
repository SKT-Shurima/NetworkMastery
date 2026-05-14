import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import KnowledgeGraph from '../KnowledgeGraph.vue'

const fakeGraph = {
  domains: [
    { id: 'sdwan', name_zh: 'SD-WAN', color: 'magenta', default: true, order: 1 },
    { id: 'basics', name_zh: '基础', color: 'cyan', default: false, order: 2 },
  ],
  concepts: {
    'sdwan-core': {
      id: 'sdwan-core', name_zh: 'SD-WAN', short: 's', level: 'L2',
      domain: 'sdwan', is_hub: true, x: 320, y: 160, neighbors: [], on_paths: ['entry']
    },
    'osi': {
      id: 'osi', name_zh: 'OSI', short: 's', level: 'L1',
      domain: 'basics', x: 100, y: 60, neighbors: [], on_paths: []
    },
  },
  paths: [
    { id: 'entry', name_zh: '入门', color: '#00d4ff', segments: [] },
  ],
}

describe('KnowledgeGraph', () => {
  it('defaults to the domain marked default=true', () => {
    const w = mount(KnowledgeGraph, { props: { graphData: fakeGraph } })
    expect(w.vm.activeDomainId).toBe('sdwan')
  })

  it('renders tabs for each domain', () => {
    const w = mount(KnowledgeGraph, { props: { graphData: fakeGraph } })
    const tabs = w.findAll('.domain-tab')
    expect(tabs.length).toBe(2)
  })

  it('opens drawer when concept selected', async () => {
    const w = mount(KnowledgeGraph, { props: { graphData: fakeGraph } })
    w.vm.selectConcept('sdwan-core')
    await nextTick()
    expect(w.vm.activeConceptId).toBe('sdwan-core')
  })

  it('switching tabs filters concepts by domain', async () => {
    const w = mount(KnowledgeGraph, { props: { graphData: fakeGraph } })
    expect(w.vm.visibleConcepts.length).toBe(1)
    expect(w.vm.visibleConcepts[0].id).toBe('sdwan-core')
    w.vm.activeDomainId = 'basics'
    await nextTick()
    expect(w.vm.visibleConcepts[0].id).toBe('osi')
  })
})
