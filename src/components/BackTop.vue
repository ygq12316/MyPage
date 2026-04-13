<template>
  <div class="controls-container" :style="isShow">
    <!-- 主题切换按钮 -->
    <button class="control-btn theme-btn" @click="toggleDarkMode" :class="{'dark-mode': icon === 'icontaiyang'}">
      <i :class="'iconfont ' + icon"></i>
      <span class="tooltip">{{ icon === 'icontaiyang' ? '切换到浅色' : '切换到深色' }}</span>
    </button>
    
    <!-- 回到顶部按钮 -->
    <button class="control-btn top-btn" @click="backTop">
      <i class="iconfont iconziyuanldpi"></i>
      <span class="tooltip">回到顶部</span>
    </button>
  </div>
</template>

<script>
export default {
  mounted() {
    window.addEventListener("scroll", this.scrollToTop);
    
    // 初始化时检查本地存储中的主题设置
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      this.applyTheme(savedTheme === 'dark');
    }
  },
  destroyed() {
    window.removeEventListener("scroll", this.scrollToTop);
  },
  data: function() {
    return {
      isShow: "",
      isOut: "rightside-out",
      icon: "iconyueliang" // 默认为月亮图标（切换到暗色模式）
    };
  },
  methods: {
    // 回到顶部方法
    backTop() {
      window.scrollTo({
        behavior: "smooth",
        top: 0
      });
    },
    // 为了计算距离顶部的高度，当高度大于100显示回顶部图标，小于100则隐藏
    scrollToTop() {
      const that = this;
      let scrollTop =
        window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop;
      that.scrollTop = scrollTop;
      if (that.scrollTop > 20) {
        that.isShow = "opacity: 1;transform: translateX(-38px);";
      } else {
        that.isShow = "";
      }
    },
    // 保留原有的主题切换功能
    toggleDarkMode() {
      const isDark = this.icon === "iconyueliang"; // 如果当前是月亮图标，表示将要切换到深色模式
      this.applyTheme(isDark);
      
      // 保存主题设置到本地存储
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
    },
    // 应用主题的方法
    applyTheme(isDark) {
      // 更新图标
      this.icon = isDark ? "icontaiyang" : "iconyueliang";
      
      // 更新 Vuetify 主题
      this.$vuetify.theme.dark = isDark;
      
      // 更新文档类和属性
      if (isDark) {
        document.body.classList.add('theme-dark');
        document.documentElement.setAttribute('data-theme', 'dark');
      } else {
        document.body.classList.remove('theme-dark');
        document.documentElement.setAttribute('data-theme', 'light');
        
        // 清除可能残留的内联样式
        this.cleanupInlineStyles();
      }
      
      // 触发主题变化事件
      this.$root.$emit('theme-changed', isDark);
    },
    // 清理内联样式
    cleanupInlineStyles() {
      // 找到可能在深色模式下被设置内联style的元素
      const elementsWithInlineStyles = document.querySelectorAll('[style*="color"]');
      elementsWithInlineStyles.forEach(el => {
        // 如果内联样式包含了白色文本，则移除该内联样式
        if (el.style.color && 
            (el.style.color.includes('#fff') || 
             el.style.color.includes('white') || 
             el.style.color.includes('rgb(255, 255, 255)'))) {
          el.style.color = '';
        }
      });
    
      // 该行代码会强制浏览器重新计算样式
      void document.body.offsetHeight; 
      document.body.style.display = '';
    }
  }
};
</script>

<style scoped>
.controls-container {
  z-index: 10;
  position: fixed;
  right: -38px;
  bottom: 100px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  opacity: 0;
}

.control-btn {
  width: 46px;
  height: 46px;
  border-radius: 23px;
  border: none;
  outline: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
  position: relative;
}

.control-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
}

.control-btn:active {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.control-btn i {
  font-size: 20px;
}

/* 主题切换按钮样式 */
.theme-btn {
  background: linear-gradient(135deg, #ffa751, #ffe259);
  color: #fff;
}

/* 深色主题下的主题按钮 */
.theme-btn.dark-mode {
  background: linear-gradient(135deg, #8E2DE2, #4A00E0);
}

/* 回到顶部按钮样式 */
.top-btn {
  background: linear-gradient(135deg, #36D1DC, #5B86E5);
  color: #fff;
}

/* 工具提示效果 */
.tooltip {
  position: absolute;
  top: 50%;
  right: 60px;
  transform: translateY(-50%);
  background-color: rgba(0, 0, 0, 0.7);
  color: #fff;
  padding: 6px 10px;
  border-radius: 4px;
  font-size: 12px;
  white-space: nowrap;
  pointer-events: none;
  opacity: 0;
  transition: all 0.3s ease;
  z-index: 100;
}

.tooltip::after {
  content: '';
  position: absolute;
  top: 50%;
  right: -5px;
  transform: translateY(-50%);
  border-width: 5px 0 5px 5px;
  border-style: solid;
  border-color: transparent transparent transparent rgba(0, 0, 0, 0.7);
}

.control-btn:hover .tooltip {
  opacity: 1;
  right: 54px;
}

/* 深色模式适配 */
.theme--dark .top-btn {
  background: linear-gradient(135deg, #3f51b5, #5677fc);
}

/* 滚动显示动画 */
@keyframes float-in {
  0% {
    transform: translateX(20px);
    opacity: 0;
  }
  100% {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes pulse {
  0% {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
  50% {
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.25);
  }
  100% {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
}

/* 在移动设备上的优化 */
@media (max-width: 768px) {
  .control-btn {
    width: 40px;
    height: 40px;
  }
  
  .control-btn i {
    font-size: 18px;
  }
  
  .tooltip {
    display: none;
  }
}

/* 添加按钮出现动画效果 */
.controls-container[style*="opacity: 1"] .control-btn {
  animation: float-in 0.5s ease forwards, pulse 2s infinite 1s;
  animation-delay: calc(var(--i, 0) * 0.1s);
}

.controls-container[style*="opacity: 1"] .theme-btn {
  --i: 0;
}

.controls-container[style*="opacity: 1"] .top-btn {
  --i: 1;
}
</style>
