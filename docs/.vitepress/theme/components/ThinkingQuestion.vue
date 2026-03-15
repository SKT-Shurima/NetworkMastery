<script setup>
import { ref } from 'vue'

const props = defineProps({
  question: {
    type: String,
    required: true
  },
  hint: {
    type: String,
    default: ''
  },
  answer: {
    type: String,
    default: ''
  }
})

const showHint = ref(false)
const showAnswer = ref(false)
</script>

<template>
  <div class="thinking-question">
    <div class="tq-header">
      <span class="tq-icon">🤔</span>
      <span class="tq-label">思考题</span>
    </div>
    
    <div class="tq-question">
      {{ question }}
    </div>
    
    <div v-if="hint" class="tq-actions">
      <button 
        @click="showHint = !showHint" 
        class="tq-btn tq-btn-hint"
      >
        <span class="btn-icon">💡</span>
        {{ showHint ? '隐藏提示' : '查看提示' }}
      </button>
      
      <button 
        v-if="answer"
        @click="showAnswer = !showAnswer" 
        class="tq-btn tq-btn-answer"
      >
        <span class="btn-icon">✓</span>
        {{ showAnswer ? '隐藏答案' : '查看答案' }}
      </button>
    </div>
    
    <div v-if="showHint && hint" class="tq-hint">
      <div class="hint-label">💡 提示</div>
      <div class="hint-content">{{ hint }}</div>
    </div>
    
    <div v-if="showAnswer && answer" class="tq-answer">
      <div class="answer-label">✓ 参考答案</div>
      <div class="answer-content">{{ answer }}</div>
    </div>
  </div>
</template>

<style scoped>
.thinking-question {
  background: rgba(10, 14, 39, 0.9);
  backdrop-filter: blur(16px);
  border: 2px solid var(--neon-purple);
  border-radius: 12px;
  padding: 28px;
  margin: 2rem 0;
  box-shadow: 
    0 0 30px rgba(139, 92, 246, 0.4),
    inset 0 0 30px rgba(139, 92, 246, 0.05);
  position: relative;
  overflow: hidden;
}

.thinking-question::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, var(--neon-purple), var(--neon-magenta));
  box-shadow: 0 0 15px rgba(139, 92, 246, 0.8);
}

.tq-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.tq-icon {
  font-size: 1.5rem;
  filter: drop-shadow(0 0 10px rgba(139, 92, 246, 0.8));
}

.tq-label {
  font-family: var(--font-display);
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--neon-purple);
  text-shadow: 0 0 10px rgba(139, 92, 246, 0.6);
  text-transform: uppercase;
  letter-spacing: 0.15em;
}

.tq-question {
  font-family: var(--font-body);
  font-size: 1.1rem;
  line-height: 1.8;
  color: rgba(255, 255, 255, 0.95);
  margin-bottom: 20px;
  font-weight: 500;
}

.tq-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 16px;
}

.tq-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  font-family: var(--font-display);
  font-size: 0.85rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  border: 2px solid;
  border-radius: 6px;
  background: rgba(10, 14, 39, 0.8);
  cursor: pointer;
  transition: all 0.3s ease;
}

.tq-btn-hint {
  border-color: var(--neon-yellow);
  color: var(--neon-yellow);
}

.tq-btn-hint:hover {
  background: rgba(255, 222, 0, 0.1);
  box-shadow: 0 0 20px rgba(255, 222, 0, 0.5);
  transform: translateY(-2px);
}

.tq-btn-answer {
  border-color: var(--neon-green);
  color: var(--neon-green);
}

.tq-btn-answer:hover {
  background: rgba(0, 255, 65, 0.1);
  box-shadow: 0 0 20px rgba(0, 255, 65, 0.5);
  transform: translateY(-2px);
}

.btn-icon {
  font-size: 1.1rem;
}

.tq-hint,
.tq-answer {
  margin-top: 16px;
  padding: 16px;
  border-radius: 8px;
  animation: slide-down 0.3s ease-out;
}

@keyframes slide-down {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.tq-hint {
  background: rgba(255, 222, 0, 0.1);
  border-left: 4px solid var(--neon-yellow);
}

.tq-answer {
  background: rgba(0, 255, 65, 0.1);
  border-left: 4px solid var(--neon-green);
}

.hint-label,
.answer-label {
  font-family: var(--font-display);
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 8px;
}

.hint-label {
  color: var(--neon-yellow);
  text-shadow: 0 0 10px rgba(255, 222, 0, 0.6);
}

.answer-label {
  color: var(--neon-green);
  text-shadow: 0 0 10px rgba(0, 255, 65, 0.6);
}

.hint-content,
.answer-content {
  font-family: var(--font-body);
  font-size: 1rem;
  line-height: 1.7;
  color: rgba(255, 255, 255, 0.9);
}
</style>
