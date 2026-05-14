---
title: Icon System Design — Replace Emoji with Modern Icons
date: 2026-05-14
status: approved
---

# Icon System Design

## Goal

Replace all emoji throughout the documentation site with modern line-style icons that match the cyberpunk theme.

**Scope**: 80 markdown files (107 unique emoji), 8+ Vue components, `learningPath.js`.

## Decisions

| Decision | Choice | Rationale |
|---|---|---|
| Icon library | **Lucide** (`lucide-vue-next`) | Line-style, cyberpunk-friendly, MIT, tree-shakeable, ~1500 icons |
| Markdown integration | **Global `<Icon />` Vue component** | Type-safe, parameterized (color/size/glow), works in both `.md` and `.vue` |
| Status symbols (`✓ ✗ ✅ ❌ ★`) | **Replace with `<Icon />`** | Visual consistency over diff size; ~500 occurrences |
| Rollout | **3 phases**, independent commits | Each phase verifiable, easy rollback |

## Architecture

```
docs/.vitepress/theme/
├── components/Icon.vue       # Global icon component
├── icons/emoji-map.js        # emoji → lucide name mapping (~107 entries)
└── index.js                  # registers <Icon /> globally

scripts/replace-emoji.mjs     # Batch replacer for markdown files
```

## `<Icon />` Component Contract

```html
<Icon
  name="check"          <!-- required: lucide kebab-case name -->
  size="1em"            <!-- default 1em; accepts 16/20/24/etc -->
  color="green"         <!-- preset: cyan/green/magenta/purple/warn/danger -->
  glow                  <!-- optional: neon drop-shadow -->
  stroke="1.75"         <!-- default 1.75 (cyberpunk thin lines) -->
/>
```

Defaults: inherits `currentColor`, sizes to `1em` so it aligns with surrounding text. Fallback icon: `circle-help` if `name` is invalid.

## Emoji → Icon Mapping (core ~30, covers ~95% of usage)

| Emoji | Use | Lucide name | Default color |
|---|---|---|---|
| `✓` `✅` | correct/supported | `check` / `check-circle-2` | green |
| `✗` `❌` | wrong/unsupported | `x` / `x-circle` | danger |
| `★` `☆` | emphasis/rating | `star` | cyan |
| `⚠` | warning | `triangle-alert` | warn |
| `💡` | tip/insight | `lightbulb` | cyan |
| `📋` | checklist | `clipboard-list` | cyan |
| `📊` | chart/data | `bar-chart-3` | cyan |
| `🔄` | cycle/sync | `refresh-cw` | cyan |
| `🚀` | launch/evolution | `rocket` | magenta |
| `🎯` | target/goal | `target` | magenta |
| `🌐` | network/global | `globe` | cyan |
| `🏢` | enterprise | `building-2` | cyan |
| `⚡` | speed/evolution | `zap` | cyan |
| `🔧` | tools/practice | `wrench` | cyan |
| `📡` | SDN/radio | `radio-tower` | cyan |
| `🔒` `🔐` | security/crypto | `lock` / `lock-keyhole` | green |
| `🛡` | defense | `shield` | green |
| `🏗` | architecture | `layers` | purple |
| `☁` | cloud | `cloud` | cyan |
| `📦` | container/package | `package` | cyan |
| `📁` | folder | `folder` | cyan |
| `📄` `📝` | document/note | `file-text` | cyan |
| `📌` | pin/important | `pin` | magenta |
| `📐` | spec/ruler | `ruler` | cyan |
| `🔍` | search | `search` | cyan |
| `🤔` | thinking | `help-circle` | purple |
| `🟢` `🔴` `🟡` | status dot | CSS `<span class="status-dot status-{green|red|yellow}"/>` | — |
| `⛶` | fullscreen | `maximize-2` | cyan |
| `✕` | close | `x` | cyan |

Full 107-entry mapping lives in `emoji-map.js`. An audit script flags any uncovered emoji.

## Rollout Plan

### P1 — Infrastructure
- Install `lucide-vue-next`
- Create `Icon.vue` + `emoji-map.js`
- Register globally in `theme/index.js`
- Convert Vue components: `CyberpunkHome.vue`, `learningPath.js`, `ConceptDrawer.vue`, `LineToolbar.vue`, `SearchBar.vue`, `ThinkingQuestion.vue`, `KnowledgeGraph.vue` (any with emoji)
- Write `scripts/replace-emoji.mjs` (skips fenced code blocks, uses emoji-map.js)
- Verify dev server: home page + graph + drawer

### P2 — Core docs
- `docs/index.md`, `docs/faq.md`, `docs/cyber-demo.md`
- `docs/guide/basics/*.md` (~10 files)
- `docs/guide/sdwan/*.md` (~5 files)
- Spot-check rendering

### P3 — Remaining docs
- ~60 remaining markdown files
- Run batch script + manual sample audit
- Final grep confirms 0 emoji residual

## Risks & Mitigations

| Risk | Mitigation |
|---|---|
| Replacement touches emoji inside code blocks | Script skips fenced ` ``` ` and inline `` ` `` regions |
| Lucide lacks a perfect semantic match for some emoji | Pick closest + note in mapping table comment |
| Icon color clashes with context | Defaults to `currentColor`; override with `color` prop |
| Large diff in single commit | 3 independent phases; each can be reverted in isolation |

## Acceptance Criteria

1. `grep -rhoE '[\x{1F300}-\x{1FAFF}]|[\x{2600}-\x{27BF}]|[\x{1F000}-\x{1F2FF}]' docs/ --include="*.md"` returns 0 results (source files only, excluding `dist/`)
2. `<Icon />` works in both `.md` and `.vue` files
3. Home page features render with lucide icons matching cyberpunk theme
4. Build (`npm run build`) succeeds
5. Tests pass (`npm test`)
