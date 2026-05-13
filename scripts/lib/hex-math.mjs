// Pointy-top hex 几何。row/col 用 offset coordinates（奇数 row 向右偏半宽）。
// 顶点顺序：[T, TR, BR, B, BL, TL]（顺时针从顶部开始）

const SQRT3 = Math.sqrt(3)

/**
 * 把 (row, col) 轴坐标换算成 SVG 像素坐标。
 * @param {number} row 整数
 * @param {number} col 整数（可负）
 * @param {number} size hex 半径（中心到顶点）
 * @param {[number, number]} origin (cx, cy) 在 SVG 坐标中的中心点
 * @returns {[number, number]} [x, y]
 */
export function axialToPixel(row, col, size, origin) {
  const [ox, oy] = origin
  const w = SQRT3 * size
  const h = 1.5 * size
  const xOffset = (row % 2 === 0) ? 0 : w / 2
  const x = ox + col * w + xOffset
  const y = oy + row * h
  return [x, y]
}

/**
 * 计算 hex 的 6 个顶点（顺时针，从顶开始）。
 * @returns {Array<[number, number]>}
 */
export function getVertices(cx, cy, size) {
  const dx = SQRT3 * size / 2
  const dy = size / 2
  return [
    [cx,      cy - size],   // T  index 0
    [cx + dx, cy - dy],     // TR index 1
    [cx + dx, cy + dy],     // BR index 2
    [cx,      cy + size],   // B  index 3
    [cx - dx, cy + dy],     // BL index 4
    [cx - dx, cy - dy],     // TL index 5
  ]
}

/**
 * 返回 6 个方向的邻居 (row, col)。
 */
export function getNeighbors(row, col) {
  const isOdd = (row % 2 !== 0)
  const offset = isOdd ? 1 : 0
  return {
    E:  { row,     col: col + 1 },
    W:  { row,     col: col - 1 },
    NE: { row: row - 1, col: col + offset },
    NW: { row: row - 1, col: col - 1 + offset },
    SE: { row: row + 1, col: col + offset },
    SW: { row: row + 1, col: col - 1 + offset },
  }
}

const EDGE_VERTEX_INDICES = {
  NE: [0, 1],
  E:  [1, 2],
  SE: [2, 3],
  SW: [3, 4],
  W:  [4, 5],
  NW: [5, 0],
}

/**
 * 返回某方向上的共享边的两个端点。
 * @param {string} dir 方向缩写：'NE'|'E'|'SE'|'SW'|'W'|'NW'
 * @returns {[[number, number], [number, number]]}
 */
export function getSharedEdge(cx, cy, size, dir) {
  const verts = getVertices(cx, cy, size)
  const [i, j] = EDGE_VERTEX_INDICES[dir]
  if (i === undefined) throw new Error(`Unknown direction: ${dir}`)
  return [verts[i], verts[j]]
}

/**
 * 给定两个相邻 hex 的 (row, col)，返回 A 到 B 的方向缩写。返回 null 表示不相邻。
 */
export function directionBetween(aRow, aCol, bRow, bCol) {
  const nb = getNeighbors(aRow, aCol)
  for (const [dir, pos] of Object.entries(nb)) {
    if (pos.row === bRow && pos.col === bCol) return dir
  }
  return null
}
