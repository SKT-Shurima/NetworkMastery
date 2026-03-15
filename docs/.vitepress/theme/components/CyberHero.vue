<script setup lang="ts">
import { computed } from 'vue'

interface HeroAction {
  text: string
  link: string
  theme?: 'brand' | 'alt'
}

interface HeroConfig {
  name?: string
  text?: string
  tagline?: string
  actions?: HeroAction[]
}

const props = defineProps<{
  hero: HeroConfig
}>()

// 打字机效果文本
const typewriterText = computed(() => props.hero.tagline || '')
</script>

<template>
  <section class="cyber-hero">
    <!-- 赛博朋克背景层 -->
    <div class="cyber-hero__background">
      <!-- 网格 -->
      <div class="cyber-hero__grid"></div>
      
      <!-- 霓虹光晕 -->
      <div class="cyber-hero__glow cyber-hero__glow--cyan"></div>
      <div class="cyber-hero__glow cyber-hero__glow--magenta"></div>
      <div class="cyber-hero__glow cyber-hero__glow--purple"></div>
      
      <!-- 扫描线 -->
      <div class="cyber-hero__scanline"></div>
    </div>

    <!-- 内容层 -->
    <div class="cyber-hero__content">
      <!-- Logo / 标题 -->
      <div class="cyber-hero__title-group animate-slide-in-up">
        <h1 class="cyber-hero__title">
          <span class="cyber-hero__title-main gradient-cyber-text">
            {{ hero.name }}
          </span>
          <span v-if="hero.text" class="cyber-hero__title-sub neon-text-cyan">
            {{ hero.text }}
          </span>
        </h1>
        
        <!-- Tagline 副标题 -->
        <p v-if="hero.tagline" class="cyber-hero__tagline">
          <span class="cyber-hero__tagline-brackets neon-text-purple">[</span>
          <span class="cyber-hero__tagline-text">{{ hero.tagline }}</span>
          <span class="cyber-hero__tagline-brackets neon-text-purple">]</span>
        </p>
      </div>

      <!-- 操作按钮 -->
      <div v-if="hero.actions && hero.actions.length > 0" class="cyber-hero__actions animate-fade-in">
        <template v-for="action in hero.actions" :key="action.text">
          <a 
            :href="action.link"
            :class="[
              'cyber-button',
              action.theme === 'brand' ? 'cyber-button-primary' : ''
            ]"
          >
            <span v-if="action.theme === 'brand'" class="cyber-button__icon">▶</span>
            {{ action.text }}
            <span v-if="action.theme !== 'brand'" class="cyber-button__arrow">→</span>
          </a>
        </template>
      </div>

      <!-- 装饰元素 - 代码雨提示 -->
      <div class="cyber-hero__footer">
        <div class="cyber-hero__status">
          <span class="cyber-hero__status-dot"></span>
          <span class="cyber-hero__status-text">SYSTEM ONLINE</span>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   🎭 Hero 容器
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

.cyber-hero {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: var(--bg-dark-primary);
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   🌌 背景层
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

.cyber-hero__background {
  position: absolute;
  inset: 0;
  z-index: 0;
}

.cyber-hero__grid {
  position: absolute;
  inset: 0;
  background-image: 
    repeating-linear-gradient(
      0deg,
      rgba(0, 240, 255, 0.05) 0px,
      transparent 1px,
      transparent 50px,
      rgba(0, 240, 255, 0.05) 51px
    ),
    repeating-linear-gradient(
      90deg,
      rgba(0, 240, 255, 0.05) 0px,
      transparent 1px,
      transparent 50px,
      rgba(0, 240, 255, 0.05) 51px
    );
  background-size: 50px 50px;
  animation: grid-flow 20s linear infinite;
}

@keyframes grid-flow {
  0% {
    background-position: 0 0;
  }
  100% {
    background-position: 50px 50px;
  }
}

.cyber-hero__glow {
  position: absolute;
  border-radius: 50%;
  filter: blur(100px);
  opacity: 0.4;
  animation: float 8s ease-in-out infinite;
}

.cyber-hero__glow--cyan {
  top: 10%;
  right: 10%;
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, rgba(0, 240, 255, 0.6) 0%, transparent 70%);
}

.cyber-hero__glow--magenta {
  bottom: 20%;
  left: 10%;
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, rgba(255, 0, 110, 0.5) 0%, transparent 70%);
  animation-delay: -2s;
}

.cyber-hero__glow--purple {
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 700px;
  height: 700px;
  background: radial-gradient(circle, rgba(139, 92, 246, 0.4) 0%, transparent 70%);
  animation-delay: -4s;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0) scale(1);
  }
  50% {
    transform: translateY(-30px) scale(1.05);
  }
}

.cyber-hero__scanline {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 3px;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(0, 240, 255, 0.8) 50%,
    transparent 100%
  );
  animation: scan 4s linear infinite;
  pointer-events: none;
}

@keyframes scan {
  0% {
    top: 0%;
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    top: 100%;
    opacity: 0;
  }
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   📝 内容层
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

.cyber-hero__content {
  position: relative;
  z-index: 1;
  max-width: 1200px;
  padding: 2rem;
  text-align: center;
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   🎯 标题组
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

.cyber-hero__title-group {
  margin-bottom: 3rem;
}

.cyber-hero__title {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin: 0;
}

.cyber-hero__title-main {
  font-size: clamp(3rem, 10vw, 7rem);
  font-weight: 900;
  line-height: 1;
  letter-spacing: -0.02em;
  text-transform: uppercase;
  animation: neon-pulse 3s ease-in-out infinite;
}

.cyber-hero__title-sub {
  font-size: clamp(2rem, 6vw, 4rem);
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: 0.05em;
}

.cyber-hero__tagline {
  margin-top: 2rem;
  font-size: clamp(1rem, 2.5vw, 1.5rem);
  color: var(--text-cyber-secondary);
  font-family: 'Fira Code', 'Monaco', monospace;
  line-height: 1.6;
}

.cyber-hero__tagline-brackets {
  font-weight: 700;
  margin: 0 0.5rem;
}

.cyber-hero__tagline-text {
  color: var(--text-cyber-primary);
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   🔘 操作按钮
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

.cyber-hero__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  justify-content: center;
  align-items: center;
  margin-bottom: 4rem;
}

.cyber-button__icon {
  display: inline-block;
  margin-right: 0.5rem;
  animation: pulse-icon 1.5s ease-in-out infinite;
}

@keyframes pulse-icon {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
}

.cyber-button__arrow {
  display: inline-block;
  margin-left: 0.5rem;
  transition: transform var(--transition-normal) ease;
}

.cyber-button:hover .cyber-button__arrow {
  transform: translateX(4px);
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   🎬 页脚状态
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

.cyber-hero__footer {
  margin-top: 4rem;
}

.cyber-hero__status {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 1.5rem;
  background: var(--bg-dark-card);
  border: 1px solid rgba(0, 255, 65, 0.3);
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: var(--neon-green);
}

.cyber-hero__status-dot {
  width: 8px;
  height: 8px;
  background: var(--neon-green);
  border-radius: 50%;
  box-shadow: 0 0 10px var(--neon-green);
  animation: blink 2s ease-in-out infinite;
}

@keyframes blink {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.3;
  }
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   📱 响应式
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

@media (max-width: 768px) {
  .cyber-hero__content {
    padding: 1rem;
  }

  .cyber-hero__title-group {
    margin-bottom: 2rem;
  }

  .cyber-hero__tagline {
    margin-top: 1.5rem;
    font-size: 1rem;
  }

  .cyber-hero__actions {
    flex-direction: column;
    gap: 1rem;
  }

  .cyber-button {
    width: 100%;
    justify-content: center;
  }
}
</style>
