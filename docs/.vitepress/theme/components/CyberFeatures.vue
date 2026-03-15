<script setup lang="ts">
interface Feature {
  icon?: string
  title: string
  details: string
  link?: string
  linkText?: string
}

defineProps<{
  features: Feature[]
}>()
</script>

<template>
  <section class="cyber-features">
    <div class="cyber-features__container">
      <div class="cyber-features__grid">
        <article
          v-for="(feature, index) in features"
          :key="index"
          class="cyber-feature-card"
          :style="{ animationDelay: `${index * 0.1}s` }"
        >
          <!-- 图标 -->
          <div class="cyber-feature-card__icon-wrapper">
            <div class="cyber-feature-card__icon">
              {{ feature.icon || '⚡' }}
            </div>
          </div>

          <!-- 标题 -->
          <h3 class="cyber-feature-card__title">
            {{ feature.title }}
          </h3>

          <!-- 描述 -->
          <p class="cyber-feature-card__details">
            {{ feature.details }}
          </p>

          <!-- 链接 -->
          <a
            v-if="feature.link"
            :href="feature.link"
            class="cyber-feature-card__link"
          >
            <span>{{ feature.linkText || '了解更多' }}</span>
            <span class="cyber-feature-card__link-arrow">→</span>
          </a>

          <!-- 悬停边框效果 -->
          <div class="cyber-feature-card__border-glow"></div>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   📦 Features 容器
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

.cyber-features {
  padding: 6rem 2rem;
  background: var(--bg-dark-primary);
  position: relative;
}

.cyber-features__container {
  max-width: 1400px;
  margin: 0 auto;
}

.cyber-features__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 2rem;
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   🎴 Feature 卡片
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

.cyber-feature-card {
  position: relative;
  background: var(--bg-dark-card);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(0, 240, 255, 0.2);
  border-radius: 16px;
  padding: 2rem;
  transition: all var(--transition-normal) ease;
  animation: slide-in-up 0.6s ease-out backwards;
  overflow: hidden;
}

.cyber-feature-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: var(--gradient-cyber);
  opacity: 0;
  transition: opacity var(--transition-normal) ease;
}

.cyber-feature-card:hover::before {
  opacity: 1;
}

.cyber-feature-card:hover {
  border-color: rgba(0, 240, 255, 0.5);
  transform: translateY(-8px);
  box-shadow: 
    0 0 30px rgba(0, 240, 255, 0.3),
    0 12px 40px rgba(0, 0, 0, 0.4);
}

/* 边框发光效果 */
.cyber-feature-card__border-glow {
  position: absolute;
  inset: -2px;
  background: var(--gradient-cyber);
  border-radius: 16px;
  opacity: 0;
  z-index: -1;
  filter: blur(8px);
  transition: opacity var(--transition-normal) ease;
}

.cyber-feature-card:hover .cyber-feature-card__border-glow {
  opacity: 0.3;
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   🎨 图标
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

.cyber-feature-card__icon-wrapper {
  margin-bottom: 1.5rem;
}

.cyber-feature-card__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  font-size: 2rem;
  background: var(--bg-dark-secondary);
  border: 2px solid rgba(0, 240, 255, 0.3);
  border-radius: 12px;
  transition: all var(--transition-normal) ease;
  position: relative;
}

.cyber-feature-card__icon::after {
  content: '';
  position: absolute;
  inset: -4px;
  background: var(--gradient-neon);
  border-radius: 12px;
  opacity: 0;
  z-index: -1;
  filter: blur(8px);
  transition: opacity var(--transition-normal) ease;
}

.cyber-feature-card:hover .cyber-feature-card__icon {
  border-color: var(--neon-cyan);
  box-shadow: 
    0 0 20px rgba(0, 240, 255, 0.5),
    inset 0 0 20px rgba(0, 240, 255, 0.1);
  transform: scale(1.1) rotate(5deg);
}

.cyber-feature-card:hover .cyber-feature-card__icon::after {
  opacity: 0.4;
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   📝 文本内容
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

.cyber-feature-card__title {
  margin: 0 0 1rem 0;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-cyber-primary);
  transition: color var(--transition-normal) ease;
}

.cyber-feature-card:hover .cyber-feature-card__title {
  color: var(--neon-cyan);
  text-shadow: 0 0 10px rgba(0, 240, 255, 0.5);
}

.cyber-feature-card__details {
  margin: 0 0 1.5rem 0;
  font-size: 1rem;
  line-height: 1.7;
  color: var(--text-cyber-secondary);
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   🔗 链接
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

.cyber-feature-card__link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--neon-cyan);
  font-weight: 600;
  font-size: 0.95rem;
  text-decoration: none;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  transition: all var(--transition-normal) ease;
  position: relative;
}

.cyber-feature-card__link::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 0;
  width: 0;
  height: 2px;
  background: var(--gradient-neon);
  transition: width var(--transition-normal) ease;
}

.cyber-feature-card__link:hover::after {
  width: 100%;
}

.cyber-feature-card__link:hover {
  color: var(--neon-green);
  text-shadow: 0 0 10px rgba(0, 255, 65, 0.5);
}

.cyber-feature-card__link-arrow {
  display: inline-block;
  transition: transform var(--transition-normal) ease;
}

.cyber-feature-card__link:hover .cyber-feature-card__link-arrow {
  transform: translateX(4px);
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   📱 响应式
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

@media (max-width: 768px) {
  .cyber-features {
    padding: 4rem 1rem;
  }

  .cyber-features__grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .cyber-feature-card {
    padding: 1.5rem;
  }

  .cyber-feature-card__icon {
    width: 56px;
    height: 56px;
    font-size: 1.75rem;
  }

  .cyber-feature-card__title {
    font-size: 1.25rem;
  }
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   🎬 动画
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

@keyframes slide-in-up {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
