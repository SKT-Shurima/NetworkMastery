import { readFileSync, readdirSync, existsSync } from 'node:fs'
import { join, basename } from 'node:path'
import yaml from 'js-yaml'

const REQUIRED_CONCEPT_FIELDS = ['id', 'name_zh', 'short', 'level', 'neighbors']
const REQUIRED_DOMAIN_FIELDS = ['id', 'name_zh', 'color']
const VALID_LEVELS = ['L1', 'L2', 'L3', 'L4']

function loadYaml(filePath) {
  if (!existsSync(filePath)) {
    throw new Error(`yaml-loader: file not found: ${filePath}`)
  }
  try {
    return yaml.load(readFileSync(filePath, 'utf-8'))
  } catch (e) {
    throw new Error(`yaml-loader: parse error in ${filePath}: ${e.message}`)
  }
}

export function loadDomain(domainYamlPath) {
  const raw = loadYaml(domainYamlPath)
  const file = basename(domainYamlPath)

  if (!raw.domain) throw new Error(`${file}: missing top-level 'domain' field`)
  if (!Array.isArray(raw.concepts)) throw new Error(`${file}: 'concepts' must be an array`)

  for (const k of REQUIRED_DOMAIN_FIELDS) {
    if (!raw.domain[k]) throw new Error(`${file}: domain.${k} is required`)
  }

  for (const [i, c] of raw.concepts.entries()) {
    for (const k of REQUIRED_CONCEPT_FIELDS) {
      if (c[k] === undefined || c[k] === null) {
        throw new Error(`${file}: concepts[${i}] (id=${c.id || '?'}) missing required field '${k}'`)
      }
    }
    if (!VALID_LEVELS.includes(c.level)) {
      throw new Error(`${file}: concept '${c.id}' has invalid level '${c.level}'. Must be one of ${VALID_LEVELS.join(', ')}`)
    }
    if (!Array.isArray(c.neighbors)) {
      throw new Error(`${file}: concept '${c.id}' neighbors must be an array`)
    }
  }

  return raw
}

export function loadAllDomains(conceptsDir) {
  const files = readdirSync(conceptsDir).filter(f => f.endsWith('.yaml') && !f.startsWith('_'))
  return files.map(f => loadDomain(join(conceptsDir, f)))
}

export function loadPaths(pathsYamlPath) {
  const raw = loadYaml(pathsYamlPath)
  if (!Array.isArray(raw?.paths)) throw new Error('paths.yaml: must contain top-level array `paths`')
  for (const p of raw.paths) {
    if (!p.id || !p.name_zh || !p.color || !Array.isArray(p.stops)) {
      throw new Error(`paths.yaml: path '${p.id || '?'}' missing required fields (id/name_zh/color/stops)`)
    }
    if (p.stops.length < 2) {
      throw new Error(`paths.yaml: path '${p.id}' must have at least 2 stops`)
    }
  }
  return raw.paths
}

export function loadLayout(layoutYamlPath) {
  const raw = loadYaml(layoutYamlPath)
  const keys = Object.keys(raw)
  if (keys.length !== 1) {
    throw new Error(`${basename(layoutYamlPath)}: must have exactly one top-level domain key, found: ${keys.join(', ')}`)
  }
  const layout = raw[keys[0]]
  if (!Array.isArray(layout?.cells)) {
    throw new Error(`${basename(layoutYamlPath)}: layout must contain 'cells' array`)
  }
  for (const cell of layout.cells) {
    if (!cell.id || typeof cell.row !== 'number' || typeof cell.col !== 'number') {
      throw new Error(`${basename(layoutYamlPath)}: cell missing id/row/col: ${JSON.stringify(cell)}`)
    }
  }
  return { domainId: keys[0], ...layout }
}
