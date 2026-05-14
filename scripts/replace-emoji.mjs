#!/usr/bin/env node
// Batch-replace emoji in markdown files with <Icon /> components.
// Usage:
//   node scripts/replace-emoji.mjs <glob-or-file> [--dry] [--report]
//
// Behavior:
//   - Skips fenced code blocks (```...```) and inline code (`...`).
//   - Skips frontmatter blocks (--- ... ---).
//   - Replaces only emojis defined in docs/.vitepress/theme/icons/emoji-map.mjs.
//   - Unknown emojis are reported, not touched.
//
// Examples:
//   node scripts/replace-emoji.mjs docs/index.md
//   node scripts/replace-emoji.mjs 'docs/guide/basics/**/*.md'
//   node scripts/replace-emoji.mjs docs/ --report

import { readFileSync, writeFileSync, statSync, readdirSync } from 'node:fs'
import { join, extname } from 'node:path'
import { emojiMap } from '../docs/.vitepress/theme/icons/emoji-map.mjs'

const args = process.argv.slice(2)
const dryRun = args.includes('--dry')
const reportOnly = args.includes('--report')
const targets = args.filter((a) => !a.startsWith('--'))

if (targets.length === 0) {
  console.error('Usage: node scripts/replace-emoji.mjs <path|glob> [--dry] [--report]')
  process.exit(1)
}

// Regex matching the emoji unicode ranges in emoji-map.
// We rely on direct character lookup in emojiMap rather than a single regex —
// safer because emojis can be 1-2 codepoints.
// Primary group: emoji codepoints. Trailing FE0F (variation selector-16) is
// consumed together so it never leaks through. Standalone FE0F is matched too
// so we can strip orphaned modifiers.
const EMOJI_PATTERN = /([\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{1F000}-\u{1F2FF}])\u{FE0F}?|\u{FE0F}/gu

function collectFiles(target) {
  const stat = statSync(target)
  if (stat.isFile()) {
    return target.endsWith('.md') ? [target] : []
  }
  if (stat.isDirectory()) {
    const out = []
    for (const entry of readdirSync(target, { withFileTypes: true })) {
      // Skip build output and vendored content
      if (entry.name === 'dist' || entry.name === 'node_modules' || entry.name.startsWith('.')) continue
      const full = join(target, entry.name)
      if (entry.isDirectory()) {
        out.push(...collectFiles(full))
      } else if (entry.isFile() && extname(entry.name) === '.md') {
        out.push(full)
      }
    }
    return out
  }
  return []
}

// Split markdown into "protected" regions (code) and "open" regions.
// Returns array of { text, protected }.
function splitRegions(content) {
  const regions = []
  let i = 0
  const len = content.length

  while (i < len) {
    // Frontmatter at file start
    if (i === 0 && content.startsWith('---\n')) {
      const end = content.indexOf('\n---', 4)
      if (end !== -1) {
        regions.push({ text: content.slice(0, end + 4), protected: true })
        i = end + 4
        continue
      }
    }

    // Fenced code block ``` or ~~~
    if (content.startsWith('```', i) || content.startsWith('~~~', i)) {
      const fence = content.slice(i, i + 3)
      const end = content.indexOf('\n' + fence, i + 3)
      if (end !== -1) {
        const close = end + 1 + 3
        regions.push({ text: content.slice(i, close), protected: true })
        i = close
        continue
      } else {
        // Unterminated — treat rest as protected
        regions.push({ text: content.slice(i), protected: true })
        i = len
        continue
      }
    }

    // Inline code `...`
    if (content[i] === '`') {
      const end = content.indexOf('`', i + 1)
      if (end !== -1) {
        regions.push({ text: content.slice(i, end + 1), protected: true })
        i = end + 1
        continue
      }
    }

    // Plain text — accumulate until next protected start
    let j = i
    while (j < len) {
      const ch = content[j]
      const next3 = content.slice(j, j + 3)
      if (ch === '`' || next3 === '```' || next3 === '~~~') break
      j++
    }
    regions.push({ text: content.slice(i, j), protected: false })
    i = j
  }
  return regions
}

function buildIconTag(emoji) {
  const m = emojiMap[emoji]
  if (!m) return null
  if (m.icon === '__remove__') return ''
  const attrs = [`name="${m.icon}"`]
  if (m.color) attrs.push(`color="${m.color}"`)
  if (m.filled) attrs.push('filled')
  return `<Icon ${attrs.join(' ')} />`
}

function processFile(file) {
  const content = readFileSync(file, 'utf-8')
  const regions = splitRegions(content)
  const unknown = new Map() // emoji → count
  let replacedCount = 0

  const out = regions
    .map((r) => {
      if (r.protected) return r.text
      return r.text.replace(EMOJI_PATTERN, (match, base) => {
        // Orphan FE0F variation selector — silently strip
        if (base === undefined) {
          replacedCount++
          return ''
        }
        const tag = buildIconTag(base)
        if (tag === null) {
          unknown.set(base, (unknown.get(base) || 0) + 1)
          return match
        }
        replacedCount++
        return tag
      })
    })
    .join('')

  return { content: out, original: content, replacedCount, unknown }
}

const files = targets.flatMap(collectFiles)
let totalReplaced = 0
const unknownGlobal = new Map()
const touched = []

for (const file of files) {
  const result = processFile(file)
  if (result.replacedCount > 0) {
    totalReplaced += result.replacedCount
    touched.push({ file, count: result.replacedCount })
    if (!dryRun && !reportOnly) {
      writeFileSync(file, result.content, 'utf-8')
    }
  }
  for (const [e, c] of result.unknown) {
    unknownGlobal.set(e, (unknownGlobal.get(e) || 0) + c)
  }
}

console.log(`\nProcessed ${files.length} files`)
console.log(`Touched   ${touched.length} files (${totalReplaced} replacements)`)
if (dryRun || reportOnly) console.log('(dry run — no files written)')

if (touched.length > 0 && (dryRun || reportOnly)) {
  console.log('\nFiles that would change:')
  for (const t of touched.slice(0, 20)) {
    console.log(`  ${t.count.toString().padStart(4)}  ${t.file}`)
  }
  if (touched.length > 20) console.log(`  ... and ${touched.length - 20} more`)
}

if (unknownGlobal.size > 0) {
  console.log('\nUnknown emoji (not in emoji-map.mjs):')
  const sorted = [...unknownGlobal.entries()].sort((a, b) => b[1] - a[1])
  for (const [e, c] of sorted) {
    console.log(`  ${e}  ×${c}`)
  }
  process.exitCode = 2
}
