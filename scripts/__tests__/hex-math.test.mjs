import { describe, it, expect } from 'vitest'
import { axialToPixel, getVertices, getNeighbors, getSharedEdge } from '../lib/hex-math.mjs'

const r = 26
const origin = [320, 160]

describe('axialToPixel', () => {
  it('原点是 row=0,col=0', () => {
    expect(axialToPixel(0, 0, r, origin)).toEqual([320, 160])
  })

  it('右邻居在 row=0,col=1', () => {
    const [x, y] = axialToPixel(0, 1, r, origin)
    expect(x).toBeCloseTo(320 + Math.sqrt(3) * 26, 2)
    expect(y).toBeCloseTo(160, 2)
  })

  it('下一行 row=1 偏移 1.5*r 高度 + 半宽偏移', () => {
    const [x, y] = axialToPixel(1, 0, r, origin)
    expect(x).toBeCloseTo(320 + Math.sqrt(3) * 26 / 2, 2)
    expect(y).toBeCloseTo(160 + 1.5 * 26, 2)
  })
})

describe('getVertices', () => {
  it('返回 6 个顶点，顺时针从顶部开始', () => {
    const verts = getVertices(320, 160, 26)
    expect(verts).toHaveLength(6)
    expect(verts[0]).toEqual([320, 134])       // top
    expect(verts[1][0]).toBeCloseTo(342.52, 1) // top-right
    expect(verts[3]).toEqual([320, 186])       // bottom
  })
})

describe('getNeighbors', () => {
  it('偶数 row 的邻居', () => {
    const nb = getNeighbors(2, 0)
    expect(nb.E).toEqual({ row: 2, col: 1 })
    expect(nb.W).toEqual({ row: 2, col: -1 })
    expect(nb.NE).toEqual({ row: 1, col: 0 })
    expect(nb.NW).toEqual({ row: 1, col: -1 })
    expect(nb.SE).toEqual({ row: 3, col: 0 })
    expect(nb.SW).toEqual({ row: 3, col: -1 })
  })

  it('奇数 row 的邻居（向右偏移）', () => {
    const nb = getNeighbors(1, 0)
    expect(nb.NE).toEqual({ row: 0, col: 1 })
    expect(nb.NW).toEqual({ row: 0, col: 0 })
    expect(nb.SE).toEqual({ row: 2, col: 1 })
    expect(nb.SW).toEqual({ row: 2, col: 0 })
  })
})

describe('getSharedEdge', () => {
  it('E 方向：垂直边在右侧', () => {
    const edge = getSharedEdge(320, 160, 26, 'E')
    expect(edge[0][0]).toBeCloseTo(342.52, 1)
    expect(edge[0][1]).toBeCloseTo(147, 1)
    expect(edge[1][0]).toBeCloseTo(342.52, 1)
    expect(edge[1][1]).toBeCloseTo(173, 1)
  })

  it('NE 方向：顶部到右上的斜边', () => {
    const edge = getSharedEdge(320, 160, 26, 'NE')
    expect(edge[0]).toEqual([320, 134])
    expect(edge[1][0]).toBeCloseTo(342.52, 1)
    expect(edge[1][1]).toBeCloseTo(147, 1)
  })
})
