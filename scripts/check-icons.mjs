import * as L from 'lucide-vue-next';
import { emojiMap, toPascalCase } from '../docs/.vitepress/theme/icons/emoji-map.mjs';
const missing = [];
for (const [emoji, m] of Object.entries(emojiMap)) {
  if (m.icon === '__remove__') continue;
  const name = toPascalCase(m.icon);
  if (!L[name]) missing.push({ emoji, icon: m.icon, name });
}
console.log('total entries:', Object.keys(emojiMap).length);
console.log('missing lucide icons:', JSON.stringify(missing, null, 2));
