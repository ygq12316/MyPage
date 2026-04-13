<template>
  <transition name="fade">
    <div class="loading-overlay" v-if="visible">
      <div class="loading-container">
        <div class="loading-animation">
          <!-- 主环形动画 -->
          <div class="orbit-spinner">
            <div class="orbit orbit-1"></div>
            <div class="orbit orbit-2"></div>
            <div class="orbit orbit-3"></div>
          </div>
          
          <!-- 波浪效果 -->
          <div class="wave-container">
            <div class="wave-circle"></div>
            <div class="wave-ripple"></div>
          </div>
          
          <!-- 浮动圆点 -->
          <div class="floating-dots">
            <div class="dot dot-1"></div>
            <div class="dot dot-2"></div>
            <div class="dot dot-3"></div>
            <div class="dot dot-4"></div>
            <div class="dot dot-5"></div>
          </div>
        </div>
        
        <!-- 动态文本显示 -->
        <div class="text-container">
          <h3 class="loading-title">{{ message }}</h3>
          <div class="typing-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'LoadingOverlay',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    message: {
      type: String,
      default: '加载中，请稍候'
    }
  }
}
</script>

<style scoped>
/* 基础布局 */
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.94);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(8px);
}

.loading-container {
  text-align: center;
  max-width: 90%;
  position: relative;
}

.loading-animation {
  position: relative;
  width: 160px;
  height: 160px;
  margin: 0 auto;
}

/* 主轨道动画 */
.orbit-spinner {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.orbit {
  position: absolute;
  border-radius: 50%;
  box-sizing: border-box;
  border: 3px solid transparent;
}

.orbit-1 {
  width: 140px;
  height: 140px;
  border-top: 3px solid #49b1f5;
  border-left: 3px solid #49b1f5;
  animation: orbit-spin 2s linear infinite;
}

.orbit-2 {
  width: 110px;
  height: 110px;
  border-top: 3px solid #ff8c69;
  border-right: 3px solid #ff8c69;
  animation: orbit-spin 1.5s linear infinite reverse;
}

.orbit-3 {
  width: 80px;
  height: 80px;
  border-bottom: 3px solid #a58fe9;
  border-left: 3px solid #a58fe9;
  animation: orbit-spin 1.2s linear infinite;
}

@keyframes orbit-spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* 波浪效果 */
.wave-container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 60px;
  height: 60px;
}

.wave-circle {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 30px;
  height: 30px;
  background: linear-gradient(135deg, #49b1f5 0%, #3f51b5 100%);
  border-radius: 50%;
  box-shadow: 0 0 15px rgba(73, 177, 245, 0.5);
  animation: wave-pulse 1.5s ease-out infinite;
}

.wave-ripple {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: 2px solid rgba(73, 177, 245, 0.5);
  animation: wave-ripple 2s ease-out infinite;
}

@keyframes wave-pulse {
  0% {
    transform: translate(-50%, -50%) scale(0.8);
    opacity: 0.8;
  }
  50% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 1;
  }
  100% {
    transform: translate(-50%, -50%) scale(0.8);
    opacity: 0.8;
  }
}

@keyframes wave-ripple {
  0% {
    width: 0;
    height: 0;
    opacity: 1;
  }
  100% {
    width: 100px;
    height: 100px;
    opacity: 0;
  }
}

/* 浮动圆点 */
.floating-dots {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
}

.dot {
  position: absolute;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #49b1f5;
  opacity: 0.8;
}

.dot-1 {
  top: 10%;
  left: 40%;
  animation: float 3s ease-in-out infinite;
  background-color: #ff8c69;
}

.dot-2 {
  top: 70%;
  left: 20%;
  animation: float 3.5s ease-in-out infinite 0.2s;
  background-color: #a58fe9;
}

.dot-3 {
  top: 20%;
  left: 80%;
  animation: float 2.8s ease-in-out infinite 0.4s;
  background-color: #49b1f5;
}

.dot-4 {
  top: 80%;
  left: 70%;
  animation: float 3.2s ease-in-out infinite 0.6s;
  background-color: #ff8c69;
}

.dot-5 {
  top: 50%;
  left: 10%;
  animation: float 2.5s ease-in-out infinite 0.8s;
  background-color: #a58fe9;
}

@keyframes float {
  0% {
    transform: translateY(0) scale(1);
  }
  50% {
    transform: translateY(-15px) scale(1.2);
  }
  100% {
    transform: translateY(0) scale(1);
  }
}

/* 文本区域 */
.text-container {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.loading-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
  letter-spacing: 0.5px;
}

/* 打字机效果的点 */
.typing-dots {
  display: flex;
  gap: 6px;
  height: 10px;
}

.typing-dots span {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: #49b1f5;
  display: inline-block;
  animation: typing 1s infinite ease-in-out;
}

.typing-dots span:nth-child(1) {
  animation-delay: 0s;
}

.typing-dots span:nth-child(2) {
  animation-delay: 0.2s;
}

.typing-dots span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes typing {
  0% {
    transform: translateY(0) scale(1);
    opacity: 0.7;
  }
  50% {
    transform: translateY(-5px) scale(1.3);
    opacity: 1;
    background-color: #a58fe9;
  }
  100% {
    transform: translateY(0) scale(1);
    opacity: 0.7;
  }
}

/* 淡入淡出过渡效果 */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter, .fade-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

/* 深色模式适配 */
.theme--dark .loading-overlay,
[data-theme='dark'] .loading-overlay,
body.theme-dark .loading-overlay {
  background: rgba(30, 30, 30, 0.94);
}

.theme--dark .loading-title,
[data-theme='dark'] .loading-title,
body.theme-dark .loading-title {
  color: #e0e0e0;
}

.theme--dark .wave-circle,
[data-theme='dark'] .wave-circle,
body.theme-dark .wave-circle {
  background: linear-gradient(135deg, #49b1f5 0%, #3f51b5 100%);
  box-shadow: 0 0 15px rgba(73, 177, 245, 0.6);
}

/* 响应式设计 */
@media (max-width: 600px) {
  .loading-animation {
    width: 120px;
    height: 120px;
  }
  
  .orbit-1 {
    width: 100px;
    height: 100px;
  }
  
  .orbit-2 {
    width: 80px;
    height: 80px;
  }
  
  .orbit-3 {
    width: 60px;
    height: 60px;
  }
  
  .loading-title {
    font-size: 16px;
  }
}
</style>
