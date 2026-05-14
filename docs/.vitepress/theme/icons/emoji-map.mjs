// emoji → Lucide icon mapping for NetworkMastery docs
// Used by:
//   - <Icon /> component (resolves name)
//   - scripts/replace-emoji.mjs (batch-replaces emoji in markdown)
//
// Each entry: { icon: 'lucide-kebab-name', color?: 'cyan|green|purple|magenta|warn|danger' }
// Color is optional — defaults to currentColor when omitted.

export const emojiMap = {
  // ── 状态符号 (status symbols) ────────────────────────
  '✓':   { icon: 'check',           color: 'green'   },
  '✅':  { icon: 'check-circle-2',   color: 'green'   },
  '✗':   { icon: 'x',               color: 'danger'  },
  '❌':  { icon: 'x-circle',         color: 'danger'  },
  '★':   { icon: 'star',            color: 'cyan'    },
  '☆':   { icon: 'star',            color: 'cyan'    },
  '⚠':   { icon: 'triangle-alert',  color: 'warn'    },
  '🚨':  { icon: 'siren',           color: 'danger'  },
  '✋':  { icon: 'hand',             color: 'warn'    },
  '🆘':  { icon: 'life-buoy',       color: 'danger'  },

  // ── 状态点 (colored dots — rendered as styled span, not lucide) ──
  '🔴':  { icon: 'circle',          color: 'danger', filled: true },
  '🟢':  { icon: 'circle',          color: 'green',  filled: true },
  '🟡':  { icon: 'circle',          color: 'warn',   filled: true },
  '🟠':  { icon: 'circle',          color: 'magenta',filled: true },
  '🟦':  { icon: 'square',          color: 'cyan',   filled: true },
  '🟥':  { icon: 'square',          color: 'danger', filled: true },
  '🟩':  { icon: 'square',          color: 'green',  filled: true },
  '🟨':  { icon: 'square',          color: 'warn',   filled: true },
  '🟧':  { icon: 'square',          color: 'magenta',filled: true },
  '🟪':  { icon: 'square',          color: 'purple', filled: true },
  '🔷':  { icon: 'diamond',         color: 'cyan'    },
  '🔶':  { icon: 'diamond',         color: 'warn'    },
  '🔵':  { icon: 'circle',          color: 'cyan',   filled: true },

  // ── 章节/卡片 (section icons) ────────────────────────
  '🌐':  { icon: 'globe',           color: 'cyan'    },
  '🌍':  { icon: 'earth',           color: 'cyan'    },
  '🌏':  { icon: 'earth',           color: 'cyan'    },
  '🌊':  { icon: 'waves',           color: 'cyan'    },
  '🏢':  { icon: 'building-2',      color: 'cyan'    },
  '🏪':  { icon: 'store',           color: 'cyan'    },
  '🏠':  { icon: 'home',            color: 'cyan'    },
  '🏭':  { icon: 'factory',         color: 'cyan'    },
  '🏛':  { icon: 'landmark',        color: 'cyan'    },
  '🏗':  { icon: 'layers',          color: 'purple'  },
  '⚡':  { icon: 'zap',             color: 'cyan'    },
  '🔧':  { icon: 'wrench',          color: 'cyan'    },
  '🛠':  { icon: 'wrench',          color: 'cyan'    },
  '⚙':   { icon: 'settings',        color: 'cyan'    },
  '📡':  { icon: 'radio-tower',     color: 'cyan'    },
  '🚀':  { icon: 'rocket',          color: 'magenta' },
  '🎯':  { icon: 'target',          color: 'magenta' },

  // ── 安全 (security) ─────────────────────────────────
  '🔒':  { icon: 'lock',            color: 'green'   },
  '🔐':  { icon: 'lock-keyhole',    color: 'green'   },
  '🔓':  { icon: 'lock-open',       color: 'warn'    },
  '🔑':  { icon: 'key-round',       color: 'warn'    },
  '🛡':  { icon: 'shield',          color: 'green'   },
  '💀':  { icon: 'skull',           color: 'danger'  },
  '🚪':  { icon: 'door-open',       color: 'cyan'    },

  // ── 内容/提示 (content & callouts) ──────────────────
  '💡':  { icon: 'lightbulb',       color: 'cyan'    },
  '📋':  { icon: 'clipboard-list',  color: 'cyan'    },
  '📊':  { icon: 'bar-chart-3',     color: 'cyan'    },
  '📈':  { icon: 'trending-up',     color: 'green'   },
  '📉':  { icon: 'trending-down',   color: 'danger'  },
  '🔄':  { icon: 'refresh-cw',      color: 'cyan'    },
  '🎨':  { icon: 'palette',         color: 'magenta' },
  '📖':  { icon: 'book-open',       color: 'cyan'    },
  '📚':  { icon: 'library',         color: 'cyan'    },
  '🎓':  { icon: 'graduation-cap',  color: 'magenta' },
  '🧠':  { icon: 'brain',           color: 'purple'  },
  '🤔':  { icon: 'help-circle',     color: 'purple'  },
  '🙈':  { icon: 'eye-off',         color: 'warn'    },
  '🤦':  { icon: 'frown',           color: 'warn'    },

  // ── 文件/存储 (files & storage) ─────────────────────
  '📄':  { icon: 'file-text',       color: 'cyan'    },
  '📝':  { icon: 'pencil-line',     color: 'cyan'    },
  '✏':   { icon: 'pencil',          color: 'cyan'    },
  '📁':  { icon: 'folder',          color: 'cyan'    },
  '🗄':  { icon: 'archive',         color: 'cyan'    },
  '🗺':  { icon: 'map',             color: 'cyan'    },
  '📦':  { icon: 'package',         color: 'cyan'    },
  '💾':  { icon: 'save',            color: 'cyan'    },
  '🔍':  { icon: 'search',          color: 'cyan'    },
  '🔗':  { icon: 'link',            color: 'cyan'    },
  '📌':  { icon: 'pin',             color: 'magenta' },
  '📍':  { icon: 'map-pin',         color: 'magenta' },
  '📐':  { icon: 'ruler',           color: 'cyan'    },
  '📜':  { icon: 'scroll-text',     color: 'cyan'    },
  '👉':  { icon: 'arrow-right',     color: 'cyan'    },

  // ── 设备/媒体 (devices & media) ─────────────────────
  '📱':  { icon: 'smartphone',      color: 'cyan'    },
  '💻':  { icon: 'laptop',          color: 'cyan'    },
  '🖨':  { icon: 'printer',         color: 'cyan'    },
  '🖼':  { icon: 'image',           color: 'cyan'    },
  '📸':  { icon: 'camera',          color: 'cyan'    },
  '🎥':  { icon: 'video',           color: 'cyan'    },
  '🎤':  { icon: 'mic',             color: 'cyan'    },
  '🎛':  { icon: 'sliders-horizontal', color: 'cyan' },
  '📟':  { icon: 'radio',           color: 'cyan'    },
  '📞':  { icon: 'phone',           color: 'cyan'    },
  '📢':  { icon: 'megaphone',       color: 'magenta' },
  '💬':  { icon: 'message-circle',  color: 'cyan'    },
  '☁':   { icon: 'cloud',           color: 'cyan'    },
  '🔥':  { icon: 'flame',           color: 'magenta' },
  '✨':  { icon: 'sparkles',        color: 'magenta' },
  '🎉':  { icon: 'party-popper',    color: 'magenta' },
  '🐌':  { icon: 'turtle',          color: 'warn'    },

  // ── 商务/角色 (business & roles) ────────────────────
  '💰':  { icon: 'circle-dollar-sign', color: 'green'  },
  '💵':  { icon: 'banknote',           color: 'green'  },
  '💼':  { icon: 'briefcase',          color: 'cyan'   },
  '⚖':   { icon: 'scale',              color: 'cyan'   },
  '👤':  { icon: 'user',               color: 'cyan'   },
  '👥':  { icon: 'users',              color: 'cyan'   },
  '👨':  { icon: 'user',               color: 'cyan'   },
  '👁':  { icon: 'eye',                color: 'cyan'   },

  // ── UI 控件 (UI controls) ───────────────────────────
  '⛶':   { icon: 'maximize-2',      color: 'cyan'    },
  '✕':   { icon: 'x',               color: 'cyan'    },

  // ── 旗帜字符 (regional indicators — usually part of country flags) ──
  // 这些通常单独出现没意义，统一移除（替换为空）
  '🇺':  { icon: '__remove__' },
  '🇸':  { icon: '__remove__' },
  '🇳':  { icon: '__remove__' },
  '🇪':  { icon: '__remove__' },
  '🇩':  { icon: '__remove__' },
  '🇨':  { icon: '__remove__' },

  // ── 其他符号 ─────────────────────────────────────────
  '♂':   { icon: '__remove__' }, // 性别符号，无语义保留必要
}

// PascalCase converter for lucide-vue-next component lookup
//   'check-circle-2' → 'CheckCircle2'
//   'x'              → 'X'
export function toPascalCase(kebab) {
  return kebab
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('')
}

// Resolve an emoji to its mapping entry. Returns null when not mapped.
export function resolveEmoji(emoji) {
  return emojiMap[emoji] || null
}
