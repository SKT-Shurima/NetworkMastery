import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import HexCell from '../HexCell.vue'

const baseProps = {
  cx: 320,
  cy: 160,
  size: 26,
  conceptId: 'sdwan-core',
  label: 'SD-WAN',
  isCore: false,
  isFocus: false,
}

describe('HexCell', () => {
  it('renders a polygon with 6 vertices', () => {
    const w = mount(HexCell, { props: baseProps })
    const points = w.find('polygon').attributes('points')
    expect(points.split(' ').length).toBe(6)
  })

  it('renders the label text', () => {
    const w = mount(HexCell, { props: baseProps })
    expect(w.text()).toContain('SD-WAN')
  })

  it('emits click event with conceptId', async () => {
    const w = mount(HexCell, { props: baseProps })
    await w.find('polygon').trigger('click')
    expect(w.emitted('select')).toBeTruthy()
    expect(w.emitted('select')[0]).toEqual(['sdwan-core'])
  })

  it('isCore adds sdwan-core class for special styling', () => {
    const w = mount(HexCell, { props: { ...baseProps, isCore: true } })
    expect(w.find('polygon').classes()).toContain('sdwan-core')
  })
})
