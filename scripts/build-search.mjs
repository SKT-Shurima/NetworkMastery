#!/usr/bin/env node
// 把概念库生成 MiniSearch 索引（模糊+前缀+同义词）
import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import MiniSearch from 'minisearch'

import { loadAllDomains } from './lib/yaml-loader.mjs'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const CONCEPTS_DIR = join(ROOT, 'data/concepts')
const OUT_DIR      = join(ROOT, 'docs/public/data')
const OUT_FILE     = join(OUT_DIR, 'search-index.json')

function main() {
  console.log('▸ build-search: indexing concepts...')
  const bundles = loadAllDomains(CONCEPTS_DIR)

  const docs = []
  for (const bundle of bundles) {
    for (const c of bundle.concepts) {
      docs.push({
        id: c.id,
        domain: bundle.domain.id,
        name_zh: c.name_zh,
        name_en: c.name_en || '',
        short: c.short || '',
        aliases: (c.aliases || []).join(' '),
        level: c.level,
      })
    }
  }

  const ms = new MiniSearch({
    idField: 'id',
    fields: ['name_zh', 'name_en', 'short', 'aliases'],
    storeFields: ['id', 'name_zh', 'name_en', 'short', 'domain', 'level'],
    searchOptions: {
      boost: { name_zh: 3, name_en: 2, aliases: 2 },
      fuzzy: 0.2,
      prefix: true,
    },
    // 简单的中文分词：按字符 + 空格
    tokenize: (text) => {
      if (!text) return []
      const tokens = []
      // 1) 空格分词的英文/数字 token
      for (const t of text.split(/[\s,，。.;:]+/).filter(Boolean)) {
        if (/^[\x00-\x7F]+$/.test(t)) tokens.push(t.toLowerCase())
      }
      // 2) 中文逐字 + 2-gram
      const chinese = text.replace(/[\x00-\x7F]/g, ' ')
      for (let i = 0; i < chinese.length; i++) {
        const c = chinese[i]
        if (c.trim() && /[一-鿿]/.test(c)) {
          tokens.push(c)
          if (i + 1 < chinese.length && /[一-鿿]/.test(chinese[i + 1])) {
            tokens.push(c + chinese[i + 1])
          }
        }
      }
      return tokens
    },
    processTerm: (term) => term.toLowerCase(),
  })

  ms.addAll(docs)

  mkdirSync(OUT_DIR, { recursive: true })
  writeFileSync(OUT_FILE, JSON.stringify(ms.toJSON()))
  console.log(`✓ build-search: indexed ${docs.length} concepts → ${OUT_FILE}`)
}

main()
