#!/usr/bin/env node
import { mkdirSync, writeFileSync, readdirSync, existsSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import { loadAllDomains, loadPaths, loadLayout } from './lib/yaml-loader.mjs'
import { axialToPixel, getSharedEdge, directionBetween } from './lib/hex-math.mjs'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const CONCEPTS_DIR = join(ROOT, 'data/concepts')
const PATHS_FILE   = join(ROOT, 'data/paths.yaml')
const LAYOUTS_DIR  = join(ROOT, 'data/layouts')
const OUT_DIR      = join(ROOT, 'docs/public/data')
const OUT_FILE     = join(OUT_DIR, 'graph.json')

function fail(msg) {
  console.error(`✗ build-graph: ${msg}`)
  process.exit(1)
}

function loadAllLayouts() {
  if (!existsSync(LAYOUTS_DIR)) return {}
  const files = readdirSync(LAYOUTS_DIR).filter(f => f.endsWith('.yaml'))
  const out = {}
  for (const f of files) {
    const { domainId, ...layout } = loadLayout(join(LAYOUTS_DIR, f))
    out[domainId] = layout
  }
  return out
}

function resolveDirNeighbor(row, col, dir) {
  const isOdd = (row % 2 !== 0)
  const off = isOdd ? 1 : 0
  switch (dir) {
    case 'E':  return [row,     col + 1]
    case 'W':  return [row,     col - 1]
    case 'NE': return [row - 1, col + off]
    case 'NW': return [row - 1, col - 1 + off]
    case 'SE': return [row + 1, col + off]
    case 'SW': return [row + 1, col - 1 + off]
  }
  throw new Error(`unknown dir ${dir}`)
}

function main() {
  console.log('▸ build-graph: loading sources...')
  const domainBundles = loadAllDomains(CONCEPTS_DIR)
  const paths = loadPaths(PATHS_FILE)
  const layouts = loadAllLayouts()

  // 收集所有概念
  const conceptMap = {}
  const domains = []
  for (const bundle of domainBundles) {
    domains.push({
      id: bundle.domain.id,
      name_zh: bundle.domain.name_zh,
      name_en: bundle.domain.name_en,
      color: bundle.domain.color,
      default: !!bundle.domain.default,
      order: bundle.domain.order ?? 99,
    })
    for (const c of bundle.concepts) {
      if (conceptMap[c.id]) fail(`duplicate concept id '${c.id}'`)
      conceptMap[c.id] = { ...c, domain: bundle.domain.id, on_paths: [] }
    }
  }
  console.log(`  ✓ ${Object.keys(conceptMap).length} concepts across ${domains.length} domains`)

  // 邻居引用存在性 + 对称性
  for (const c of Object.values(conceptMap)) {
    for (const nid of c.neighbors) {
      if (!conceptMap[nid]) fail(`concept '${c.id}' references unknown neighbor '${nid}'`)
      if (!conceptMap[nid].neighbors.includes(c.id)) {
        fail(`asymmetric neighbor: '${c.id}' lists '${nid}' but not vice versa`)
      }
    }
  }
  console.log('  ✓ neighbor references valid + symmetric')

  // 按 layout 计算坐标 + 共享边
  for (const [domainId, layout] of Object.entries(layouts)) {
    const { hex_size, origin, cells } = layout
    const cellMap = new Map()
    for (const cell of cells) {
      if (!conceptMap[cell.id]) fail(`layout ${domainId}: cell '${cell.id}' has no matching concept`)
      const [x, y] = axialToPixel(cell.row, cell.col, hex_size, origin)
      conceptMap[cell.id].x = x
      conceptMap[cell.id].y = y
      conceptMap[cell.id]._row = cell.row
      conceptMap[cell.id]._col = cell.col
      conceptMap[cell.id]._size = hex_size
      cellMap.set(`${cell.row},${cell.col}`, cell.id)
    }
    for (const cell of cells) {
      const c = conceptMap[cell.id]
      c.shared_edges = c.shared_edges || []
      for (const dir of ['NE','E','SE','SW','W','NW']) {
        const [nbRow, nbCol] = resolveDirNeighbor(cell.row, cell.col, dir)
        const nbId = cellMap.get(`${nbRow},${nbCol}`)
        if (!nbId) continue
        const [p1, p2] = getSharedEdge(c.x, c.y, hex_size, dir)
        c.shared_edges.push({
          with: nbId,
          dir,
          x1: p1[0], y1: p1[1], x2: p2[0], y2: p2[1],
        })
      }
    }
  }
  console.log(`  ✓ pixel coords + shared edges computed for ${Object.keys(layouts).length} domain(s)`)

  // 计算 paths.segments + 给每个概念打 on_paths
  const builtPaths = []
  for (const p of paths) {
    const segs = []
    for (let i = 0; i < p.stops.length - 1; i++) {
      const aId = p.stops[i]
      const bId = p.stops[i + 1]
      const a = conceptMap[aId]
      const b = conceptMap[bId]
      if (!a || !b) fail(`path '${p.id}': unknown stop '${!a ? aId : bId}'`)
      if (a._row === undefined || b._row === undefined) {
        fail(`path '${p.id}': stop '${a._row === undefined ? aId : bId}' not placed in any layout`)
      }
      const dir = directionBetween(a._row, a._col, b._row, b._col)
      if (!dir) {
        fail(`path '${p.id}': stops '${aId}' (row=${a._row},col=${a._col}) and '${bId}' (row=${b._row},col=${b._col}) are not hex neighbors`)
      }
      const [p1, p2] = getSharedEdge(a.x, a.y, a._size, dir)
      segs.push({ from: aId, to: bId, x1: p1[0], y1: p1[1], x2: p2[0], y2: p2[1] })
    }
    builtPaths.push({
      id: p.id,
      name_zh: p.name_zh,
      name_en: p.name_en,
      color: p.color,
      description: p.description,
      segments: segs,
    })
    for (const stop of p.stops) {
      if (conceptMap[stop]) conceptMap[stop].on_paths.push(p.id)
    }
  }
  console.log(`  ✓ ${builtPaths.length} path(s) compiled, ${builtPaths.reduce((n,p)=>n+p.segments.length,0)} segments total`)

  // 清理内部字段
  for (const c of Object.values(conceptMap)) {
    delete c._row; delete c._col; delete c._size
  }

  mkdirSync(OUT_DIR, { recursive: true })
  writeFileSync(OUT_FILE, JSON.stringify({
    domains: domains.sort((a, b) => a.order - b.order),
    concepts: conceptMap,
    paths: builtPaths,
  }, null, 2))
  console.log(`✓ build-graph: wrote ${OUT_FILE}`)
}

main()
