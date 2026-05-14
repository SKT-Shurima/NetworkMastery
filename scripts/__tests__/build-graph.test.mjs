import { describe, it, expect, beforeAll } from 'vitest'
import { existsSync, readFileSync } from 'node:fs'
import { execSync } from 'node:child_process'
import { join } from 'node:path'

const ROOT = process.cwd()
const OUTPUT = join(ROOT, 'docs/public/data/graph.json')

describe('build-graph integration', () => {
  let data

  beforeAll(() => {
    execSync('node scripts/build-graph.mjs', { stdio: 'inherit' })
    expect(existsSync(OUTPUT)).toBe(true)
    data = JSON.parse(readFileSync(OUTPUT, 'utf-8'))
  })

  it('produces concepts and paths and domains', () => {
    expect(data.concepts).toBeTypeOf('object')
    expect(Object.keys(data.concepts).length).toBeGreaterThanOrEqual(15)
    expect(Array.isArray(data.paths)).toBe(true)
    expect(Array.isArray(data.domains)).toBe(true)
  })

  it('sdwan-core has computed pixel coords near origin', () => {
    expect(data.concepts['sdwan-core'].x).toBeCloseTo(320, 1)
    expect(data.concepts['sdwan-core'].y).toBeCloseTo(160 + 2 * 1.5 * 26, 1)
  })

  it('sdwan-core has shared_edges with correct neighbors', () => {
    const c = data.concepts['sdwan-core']
    expect(c.shared_edges.length).toBeGreaterThanOrEqual(4)
    const neighbors = new Set(c.shared_edges.map(e => e.with))
    expect(neighbors.has('wan')).toBe(true)
    expect(neighbors.has('sdwan-arch')).toBe(true)
    expect(neighbors.has('sdwan-case')).toBe(true)
  })

  it('entry path has 4 segments (5 stops -> 4 edges)', () => {
    const entry = data.paths.find(p => p.id === 'entry')
    expect(entry).toBeDefined()
    expect(entry.segments).toHaveLength(4)
    for (const seg of entry.segments) {
      expect(seg.x1).toBeTypeOf('number')
      expect(seg.y1).toBeTypeOf('number')
      expect(seg.x2).toBeTypeOf('number')
      expect(seg.y2).toBeTypeOf('number')
    }
  })

  it('every concept has on_paths array', () => {
    for (const id of Object.keys(data.concepts)) {
      expect(Array.isArray(data.concepts[id].on_paths)).toBe(true)
    }
  })

  it('sdwan-core is marked as on entry path', () => {
    expect(data.concepts['sdwan-core'].on_paths).toContain('entry')
  })
})
