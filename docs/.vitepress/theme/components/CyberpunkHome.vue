<script setup>
import { ref, computed, onMounted } from 'vue'
import { useData, useRouter } from 'vitepress'
import { learningPaths, getProgress, getTotalHours, getTotalArticles, getNextRecommendation } from '../learningPath.js'

const { frontmatter } = useData()
const router = useRouter()

// 学习路径映射（首页 features → 学习路径）
const pathMapping = {
  0: 'basics',
  1: 'security',
  2: 'architecture',
  3: 'defense',
  4: 'sdwan',
  5: 'qos'
}

// 响应式进度数据
const pathProgress = ref({})
const nextArticle = ref(null)
const totalProgress = ref(0)

// 更新进度
function updateProgress() {
  if (typeof window === 'undefined') return
  
  Object.keys(pathMapping).forEach(index => {
    const pathId = pathMapping[index]
    pathProgress.value[pathId] = getProgress(pathId)
  })
  
  // 计算总进度
  const totalArticles = getTotalArticles()
  const completedCount = Object.values(learningPaths).reduce((sum, path) => {
    return sum + path.articles.filter(article => {
      const progress = JSON.parse(localStorage.getItem('learning-progress') || '{}')
      return progress[article.path]?.completed
    }).length
  }, 0)
  
  totalProgress.value = Math.round((completedCount / totalArticles) * 100)
  
  // 获取下一篇推荐
  nextArticle.value = getNextRecommendation()
}

onMounted(() => {
  updateProgress()
  
  // 监听路由变化，更新进度
  router.onAfterRouteChanged = () => {
    updateProgress()
  }
})

<template>
  <div class="cyberpunk-home">
    <!-- 背景层 -->
    <div class="cyber-bg">
      <div class="cyber-grid"></div>
      <div class="cyber-glow cyber-glow-1"></div>
      <div class="cyber-glow cyber-glow-2"></div>
      <div class="cyber-glow cyber-glow-3"></div>
      <div class="cyber-particles"></div>
    </div>

    <!-- Hero 区域 -->
    <section class="cyber-hero">
      <div class="cyber-hero__terminal">
        <div class="terminal-header">
          <span class="terminal-dot"></span>
          <span class="terminal-dot"></span>
          <span class="terminal-dot"></span>
          <span class="terminal-title">{{ frontmatter.hero?.name || 'SYSTEM' }}.exe</span>
        </div>
        <div class="terminal-body">
          <div class="terminal-line">
            <span class="prompt">&gt;</span>
            <span class="command">init_system</span>
          </div>
          <div class="terminal-output">
            <h1 class="cyber-title">
              <span class="glitch" :data-text="frontmatter.hero?.name">
                {{ frontmatter.hero?.name }}
              </span>
            </h1>
            <h2 class="cyber-subtitle">{{ frontmatter.hero?.text }}</h2>
            <p class="cyber-tagline">
              <span class="bracket">[</span>
              {{ frontmatter.hero?.tagline }}
              <span class="bracket">]</span>
            </p>
          </div>
          <div class="terminal-line">
            <span class="prompt">&gt;</span>
            <span class="command typing">execute_mission.sh</span>
            <span class="cursor">_</span>
          </div>
        </div>
      </div>

      <!-- 按钮组 -->
      <div class="cyber-actions">
        <a
          v-for="action in frontmatter.hero?.actions"
          :key="action.text"
          :href="action.link"
          :class="['cyber-btn', action.theme === 'brand' ? 'cyber-btn-primary' : 'cyber-btn-secondary']"
        >
          <span class="btn-border"></span>
          <span class="btn-text">{{ action.text }}</span>
          <span class="btn-icon">→</span>
        </a>
      </div>

      <!-- 状态栏 -->
      <div class="cyber-status">
        <div class="status-item">
          <span class="status-label">PROGRESS</span>
          <span class="status-value status-progress">{{ totalProgress }}%</span>
        </div>
        <div class="status-item">
          <span class="status-label">ARTICLES</span>
          <span class="status-value">{{ getTotalArticles() }}</span>
        </div>
        <div class="status-item">
          <span class="status-label">HOURS</span>
          <span class="status-value">{{ getTotalHours() }}h</span>
        </div>
      </div>

      <!-- 下一步推荐 -->
      <div v-if="nextArticle" class="next-recommendation">
        <div class="rec-header">
          <span class="rec-icon">▶</span>
          <span class="rec-label">NEXT MISSION</span>
        </div>
        <a :href="nextArticle.path" class="rec-card">
          <div class="rec-path">
            <span class="rec-path-icon">{{ nextArticle.pathIcon }}</span>
            <span class="rec-path-title">{{ nextArticle.pathTitle }}</span>
          </div>
          <h4 class="rec-title">{{ nextArticle.title }}</h4>
          <div class="rec-meta">
            <span class="rec-topics">
              <span v-for="topic in nextArticle.topics.slice(0, 3)" :key="topic" class="topic-tag">
                {{ topic }}
              </span>
            </span>
            <span class="rec-duration">{{ nextArticle.duration }} min</span>
          </div>
        </a>
      </div>
    </section>

    <!-- Features 网格 -->
    <section class="cyber-features">
      <div class="section-header">
        <h2 class="section-title">
          <span class="title-bracket">[</span>
          MODULES
          <span class="title-bracket">]</span>
        </h2>
        <div class="title-line"></div>
      </div>

      <div class="features-grid">
        <div
          v-for="(feature, index) in frontmatter.features"
          :key="index"
          class="feature-card"
          :style="{ animationDelay: `${index * 0.1}s` }"
        >
          <div class="card-corner card-corner-tl"></div>
          <div class="card-corner card-corner-tr"></div>
          <div class="card-corner card-corner-bl"></div>
          <div class="card-corner card-corner-br"></div>
          
          <div class="card-header">
            <span class="card-id">{{ String(index + 1).padStart(2, '0') }}</span>
            <div class="card-status">
              <span class="status-dot"></span>
              {{ pathProgress[pathMapping[index]] || 0 }}%
            </div>
          </div>
          
          <!-- 进度条 -->
          <div class="card-progress-bar">
            <div 
              class="card-progress-fill" 
              :style="{ width: (pathProgress[pathMapping[index]] || 0) + '%' }"
            ></div>
          </div>

          <div class="card-icon">{{ feature.icon }}</div>
          <h3 class="card-title">{{ feature.title }}</h3>
          <p class="card-details">{{ feature.details }}</p>

          <a v-if="feature.link" :href="feature.link" class="card-link">
            <span>{{ feature.linkText || 'ACCESS' }}</span>
            <span class="link-arrow">→</span>
          </a>

          <div class="card-grid"></div>
        </div>
      </div>
    </section>

    <!-- 页脚装饰 -->
    <div class="cyber-footer">
      <div class="footer-line"></div>
      <div class="footer-text">
        <span class="bracket">[</span>
        END OF TRANSMISSION
        <span class="bracket">]</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* ================================
   背景层
================================ */
.cyberpunk-home {
  position: relative;
  min-height: 100vh;
  overflow: hidden;
}

.cyber-bg {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
}

.cyber-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(0, 240, 255, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 240, 255, 0.03) 1px, transparent 1px);
  background-size: 50px 50px;
  animation: grid-flow 20s linear infinite;
}

@keyframes grid-flow {
  0% { transform: translate(0, 0); }
  100% { transform: translate(50px, 50px); }
}

.cyber-glow {
  position: absolute;
  border-radius: 50%;
  filter: blur(120px);
  opacity: 0.4;
  animation: float 10s ease-in-out infinite;
}

.cyber-glow-1 {
  top: 10%;
  left: 20%;
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, rgba(0, 240, 255, 0.6), transparent);
  animation-delay: 0s;
}

.cyber-glow-2 {
  top: 60%;
  right: 10%;
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, rgba(255, 0, 110, 0.5), transparent);
  animation-delay: -3s;
}

.cyber-glow-3 {
  bottom: 20%;
  left: 50%;
  width: 700px;
  height: 700px;
  background: radial-gradient(circle, rgba(139, 92, 246, 0.4), transparent);
  animation-delay: -6s;
}

@keyframes float {
  0%, 100% { transform: translateY(0) scale(1); }
  50% { transform: translateY(-40px) scale(1.1); }
}

/* ================================
   Hero 终端
================================ */
.cyber-hero {
  position: relative;
  z-index: 1;
  max-width: 1400px;
  margin: 0 auto;
  padding: 100px 24px 80px;
}

.cyber-hero__terminal {
  background: rgba(10, 14, 39, 0.9);
  backdrop-filter: blur(20px);
  border: 2px solid var(--neon-cyan);
  border-radius: 16px;
  box-shadow:
    0 0 40px rgba(0, 240, 255, 0.4),
    0 20px 60px rgba(0, 0, 0, 0.7),
    inset 0 0 40px rgba(0, 240, 255, 0.05);
  overflow: hidden;
  margin-bottom: 40px;
}

.terminal-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 16px 24px;
  background: rgba(0, 240, 255, 0.1);
  border-bottom: 1px solid rgba(0, 240, 255, 0.3);
}

.terminal-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: var(--neon-cyan);
  box-shadow: 0 0 10px var(--neon-cyan);
}

.terminal-dot:nth-child(2) {
  background: var(--neon-purple);
  box-shadow: 0 0 10px var(--neon-purple);
}

.terminal-dot:nth-child(3) {
  background: var(--neon-magenta);
  box-shadow: 0 0 10px var(--neon-magenta);
}

.terminal-title {
  margin-left: auto;
  font-family: var(--font-display);
  font-size: 0.85rem;
  color: var(--neon-cyan);
  text-shadow: 0 0 10px rgba(0, 240, 255, 0.6);
}

.terminal-body {
  padding: 48px 48px 64px;
}

.terminal-line {
  font-family: var(--font-display);
  font-size: 1rem;
  color: var(--neon-green);
  margin-bottom: 16px;
}

.prompt {
  color: var(--neon-cyan);
  margin-right: 12px;
  text-shadow: 0 0 10px rgba(0, 240, 255, 0.6);
}

.command {
  color: var(--neon-green);
  text-shadow: 0 0 10px rgba(0, 255, 65, 0.6);
}

.typing {
  animation: typing 2s steps(20) infinite;
}

@keyframes typing {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.cursor {
  display: inline-block;
  width: 8px;
  height: 20px;
  background: var(--neon-cyan);
  margin-left: 4px;
  animation: blink 1s step-end infinite;
}

@keyframes blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
}

.terminal-output {
  margin: 48px 0;
  text-align: center;
}

.cyber-title {
  font-family: var(--font-display);
  font-size: clamp(3.5rem, 10vw, 7rem);
  font-weight: 900;
  line-height: 1;
  margin: 0 0 24px 0;
  position: relative;
}

.glitch {
  display: inline-block;
  background: linear-gradient(135deg, var(--neon-cyan), var(--neon-purple), var(--neon-magenta));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  filter: drop-shadow(0 0 40px rgba(0, 240, 255, 0.8));
  animation: glitch 5s infinite;
}

@keyframes glitch {
  0%, 90%, 100% { transform: translate(0); }
  91% { transform: translate(-2px, 2px); }
  92% { transform: translate(2px, -2px); }
  93% { transform: translate(-2px, -2px); }
  94% { transform: translate(2px, 2px); }
}

.cyber-subtitle {
  font-family: var(--font-display);
  font-size: clamp(1.5rem, 4vw, 2.5rem);
  font-weight: 700;
  color: var(--neon-cyan);
  text-shadow: 0 0 30px rgba(0, 240, 255, 0.8);
  margin: 0 0 32px 0;
  letter-spacing: 0.1em;
}

.cyber-tagline {
  font-family: var(--font-body);
  font-size: clamp(1rem, 2vw, 1.25rem);
  color: rgba(255, 255, 255, 0.85);
  max-width: 700px;
  margin: 0 auto;
  line-height: 1.8;
}

.bracket {
  color: var(--neon-purple);
  font-family: var(--font-display);
  font-weight: 700;
  margin: 0 8px;
}

/* ================================
   按钮
================================ */
.cyber-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  justify-content: center;
  margin-bottom: 60px;
}

.cyber-btn {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 12px;
  padding: 16px 40px;
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 1rem;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  text-decoration: none;
  background: rgba(10, 14, 39, 0.8);
  border: 2px solid var(--neon-cyan);
  clip-path: polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px);
  transition: all 0.3s ease;
  overflow: hidden;
}

.cyber-btn-primary {
  background: linear-gradient(135deg, rgba(0, 240, 255, 0.2), rgba(139, 92, 246, 0.2));
  color: var(--neon-cyan);
  box-shadow:
    0 0 30px rgba(0, 240, 255, 0.5),
    inset 0 0 30px rgba(0, 240, 255, 0.1);
}

.cyber-btn-secondary {
  color: rgba(255, 255, 255, 0.9);
  border-color: rgba(0, 240, 255, 0.5);
}

.btn-border {
  position: absolute;
  inset: -2px;
  background: linear-gradient(45deg, var(--neon-cyan), var(--neon-purple), var(--neon-magenta));
  clip-path: polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px);
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: -1;
}

.cyber-btn:hover .btn-border {
  opacity: 0.3;
}

.cyber-btn:hover {
  transform: translateY(-4px);
  box-shadow:
    0 0 50px rgba(0, 240, 255, 0.7),
    inset 0 0 40px rgba(0, 240, 255, 0.2);
  color: var(--neon-green);
}

.btn-icon {
  transition: transform 0.3s ease;
}

.cyber-btn:hover .btn-icon {
  transform: translateX(6px);
}

/* ================================
   状态栏
================================ */
.cyber-status {
  display: flex;
  justify-content: center;
  gap: 48px;
  flex-wrap: wrap;
}

.status-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.status-label {
  font-family: var(--font-display);
  font-size: 0.75rem;
  color: var(--text-muted);
  letter-spacing: 0.15em;
}

.status-value {
  font-family: var(--font-display);
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--text-primary);
}

.status-online {
  color: var(--neon-green);
  text-shadow: 0 0 15px rgba(0, 255, 65, 0.8);
}

.status-secure {
  color: var(--neon-cyan);
  text-shadow: 0 0 15px rgba(0, 240, 255, 0.8);
}

.status-progress {
  color: var(--neon-purple);
  text-shadow: 0 0 15px rgba(139, 92, 246, 0.8);
}

/* ================================
   下一步推荐
================================ */
.next-recommendation {
  margin-top: 48px;
  animation: slide-up 0.8s ease-out;
}

.rec-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
  justify-content: center;
}

.rec-icon {
  color: var(--neon-cyan);
  font-size: 1.2rem;
  animation: blink 2s step-end infinite;
}

.rec-label {
  font-family: var(--font-display);
  font-size: 0.9rem;
  color: var(--neon-cyan);
  text-shadow: 0 0 10px rgba(0, 240, 255, 0.6);
  letter-spacing: 0.15em;
}

.rec-card {
  display: block;
  background: rgba(10, 14, 39, 0.9);
  border: 2px solid var(--neon-green);
  border-radius: 12px;
  padding: 24px;
  text-decoration: none;
  transition: all 0.3s ease;
  box-shadow: 
    0 0 25px rgba(0, 255, 65, 0.4),
    inset 0 0 30px rgba(0, 255, 65, 0.05);
  max-width: 600px;
  margin: 0 auto;
}

.rec-card:hover {
  border-color: var(--neon-cyan);
  box-shadow: 
    0 0 40px rgba(0, 240, 255, 0.6),
    inset 0 0 40px rgba(0, 240, 255, 0.1);
  transform: translateY(-4px) scale(1.02);
}

.rec-path {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  font-family: var(--font-display);
  font-size: 0.85rem;
  color: var(--text-muted);
}

.rec-path-icon {
  font-size: 1.2rem;
}

.rec-title {
  font-family: var(--font-display);
  font-size: 1.3rem;
  font-weight: 700;
  color: var(--neon-green);
  text-shadow: 0 0 15px rgba(0, 255, 65, 0.6);
  margin: 0 0 16px 0;
}

.rec-card:hover .rec-title {
  color: var(--neon-cyan);
  text-shadow: 0 0 20px rgba(0, 240, 255, 0.8);
}

.rec-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.rec-topics {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.topic-tag {
  font-family: var(--font-display);
  font-size: 0.75rem;
  padding: 4px 10px;
  background: rgba(0, 240, 255, 0.1);
  border: 1px solid rgba(0, 240, 255, 0.3);
  border-radius: 4px;
  color: var(--neon-cyan);
}

.rec-duration {
  font-family: var(--font-display);
  font-size: 0.85rem;
  color: var(--text-muted);
}

/* ================================
   Features 网格
================================ */
.cyber-features {
  position: relative;
  z-index: 1;
  max-width: 1400px;
  margin: 0 auto;
  padding: 80px 24px;
}

.section-header {
  text-align: center;
  margin-bottom: 60px;
}

.section-title {
  font-family: var(--font-display);
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 900;
  color: var(--neon-cyan);
  text-shadow: 0 0 30px rgba(0, 240, 255, 0.8);
  letter-spacing: 0.2em;
  margin: 0 0 24px 0;
}

.title-bracket {
  color: var(--neon-purple);
}

.title-line {
  width: 200px;
  height: 2px;
  background: linear-gradient(90deg, transparent, var(--neon-cyan), transparent);
  margin: 0 auto;
  box-shadow: 0 0 20px rgba(0, 240, 255, 0.8);
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
  gap: 32px;
}

.feature-card {
  position: relative;
  background: rgba(10, 14, 39, 0.9);
  backdrop-filter: blur(16px);
  border: 2px solid rgba(0, 240, 255, 0.4);
  padding: 36px 28px;
  clip-path: polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px);
  transition: all 0.4s ease;
  animation: slide-up 0.6s ease-out backwards;
  overflow: hidden;
}

@keyframes slide-up {
  from {
    opacity: 0;
    transform: translateY(40px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.feature-card:hover {
  border-color: var(--neon-cyan);
  transform: translateY(-8px) scale(1.02);
  box-shadow:
    0 0 40px rgba(0, 240, 255, 0.5),
    inset 0 0 40px rgba(0, 240, 255, 0.1);
}

.card-corner {
  position: absolute;
  width: 20px;
  height: 20px;
  border: 2px solid var(--neon-cyan);
}

.card-corner-tl {
  top: -2px;
  left: -2px;
  border-right: none;
  border-bottom: none;
}

.card-corner-tr {
  top: -2px;
  right: -2px;
  border-left: none;
  border-bottom: none;
}

.card-corner-bl {
  bottom: -2px;
  left: -2px;
  border-right: none;
  border-top: none;
}

.card-corner-br {
  bottom: -2px;
  right: -2px;
  border-left: none;
  border-top: none;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  font-family: var(--font-display);
  font-size: 0.75rem;
}

.card-id {
  color: var(--neon-purple);
  font-weight: 700;
  text-shadow: 0 0 10px rgba(139, 92, 246, 0.6);
}

.card-status {
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--neon-green);
  text-shadow: 0 0 10px rgba(0, 255, 65, 0.6);
}

.status-dot {
  width: 8px;
  height: 8px;
  background: var(--neon-green);
  border-radius: 50%;
  box-shadow: 0 0 10px var(--neon-green);
  animation: pulse-dot 2s ease-in-out infinite;
}

@keyframes pulse-dot {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.6; transform: scale(1.2); }
}

.card-icon {
  font-size: 4rem;
  margin-bottom: 20px;
  filter: drop-shadow(0 0 25px rgba(0, 240, 255, 0.8));
}

.card-title {
  font-family: var(--font-display);
  font-size: 1.4rem;
  font-weight: 800;
  color: var(--neon-cyan);
  text-shadow: 0 0 20px rgba(0, 240, 255, 0.6);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin: 0 0 16px 0;
  line-height: 1.3;
}

.card-details {
  font-family: var(--font-body);
  font-size: 1.05rem;
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.8;
  margin: 0 0 24px 0;
}

.card-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 0.95rem;
  color: var(--neon-green);
  text-decoration: none;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  text-shadow: 0 0 15px rgba(0, 255, 65, 0.6);
  transition: all 0.3s ease;
  border-bottom: 2px solid transparent;
}

.card-link:hover {
  color: var(--neon-cyan);
  text-shadow: 0 0 20px rgba(0, 240, 255, 0.8);
  border-bottom-color: var(--neon-cyan);
  transform: translateX(6px);
}

.link-arrow {
  transition: transform 0.3s ease;
}

.card-link:hover .link-arrow {
  transform: translateX(4px);
}

.card-grid {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 60%;
  height: 60%;
  background-image:
    linear-gradient(rgba(0, 240, 255, 0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 240, 255, 0.05) 1px, transparent 1px);
  background-size: 20px 20px;
  opacity: 0.3;
  pointer-events: none;
}

.card-progress-bar {
  position: relative;
  width: 100%;
  height: 3px;
  background: rgba(0, 240, 255, 0.2);
  border-radius: 2px;
  margin-bottom: 20px;
  overflow: hidden;
}

.card-progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--neon-green), var(--neon-cyan));
  border-radius: 2px;
  transition: width 0.6s ease;
  box-shadow: 0 0 10px rgba(0, 240, 255, 0.8);
  position: relative;
}

.card-progress-fill::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  animation: shimmer 2s infinite;
}

@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

/* ================================
   页脚
================================ */
.cyber-footer {
  position: relative;
  z-index: 1;
  text-align: center;
  padding: 60px 24px 40px;
}

.footer-line {
  width: 100%;
  max-width: 600px;
  height: 2px;
  background: linear-gradient(90deg, transparent, var(--neon-cyan), transparent);
  margin: 0 auto 24px;
  box-shadow: 0 0 20px rgba(0, 240, 255, 0.6);
}

.footer-text {
  font-family: var(--font-display);
  font-size: 0.9rem;
  color: var(--neon-cyan);
  text-shadow: 0 0 15px rgba(0, 240, 255, 0.6);
  letter-spacing: 0.15em;
}

/* ================================
   响应式
================================ */
@media (max-width: 768px) {
  .cyber-hero {
    padding: 60px 16px 40px;
  }

  .terminal-body {
    padding: 32px 24px 48px;
  }

  .cyber-actions {
    flex-direction: column;
    align-items: stretch;
  }

  .cyber-btn {
    justify-content: center;
  }

  .features-grid {
    grid-template-columns: 1fr;
    gap: 24px;
  }

  .feature-card {
    padding: 28px 20px;
  }
}
</style>
