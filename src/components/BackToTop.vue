<template>
  <div
    class="back-to-top"
    :class="{ 'in-sidebar': inSidebar, hidden: !show }"
    @click="scrollToTop"
  >
    <div class="progress-container">
      <span class="read-progress">{{ readPercentage }}%</span>
      <span class="arrow-icon">
        <i class="mdi mdi-chevron-up"></i>
      </span>
    </div>
  </div>
</template>

<script>
export default {
  name: "BackToTop",
  props: {
    inSidebar: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      show: false,
      readPercentage: 0
    };
  },
  mounted() {
    window.addEventListener("scroll", this.handleScroll);
  },
  beforeDestroy() {
    window.removeEventListener("scroll", this.handleScroll);
  },
  methods: {
    handleScroll() {
      this.show = window.pageYOffset > 300;

      const scrollHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;
      this.readPercentage = Math.round((scrollTop / scrollHeight) * 100) || 0;
    },
    scrollToTop() {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    }
  }
};
</script>

<style scoped>
.back-to-top {
  position: fixed;
  right: 50px;
  bottom: 50px;
  width: 50px;
  height: 50px;
  border-radius: 4px;
  background: linear-gradient(
    90deg,
    #6dba82 0,
    #07b39b 15%,
    #1098ad 30%,
    #5073b8 44%,
    #a166ab 58%,
    #ef4e7b 72%,
    #f37055 86%,
    #f79533 100%
  );
  color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: opacity 0.3s, transform 0.3s;
  z-index: 100;
  opacity: 0.8;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

.back-to-top:hover {
  opacity: 1;
  transform: translateY(-3px);
}

.back-to-top.hidden {
  opacity: 0;
  pointer-events: none;
}

.progress-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
}

.read-progress {
  font-size: 14px;
  font-weight: 500;
  line-height: 1;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  letter-spacing: 0.5px;
}

.arrow-icon {
  margin-top: 3px;
}

.arrow-icon i {
  font-size: 22px;
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.2));
}

/* 在侧边栏中的样式 */
.back-to-top.in-sidebar {
  position: static;
  margin: 0 -24px;
  width: calc(100% + 48px);
  height: 38px;
  border-radius: 0 0 8px 8px;
  background-size: 200% 200%;
  animation: gradientAnimation 5s ease infinite;
}

.back-to-top.in-sidebar .progress-container {
  flex-direction: row;
  justify-content: center;
  gap: 10px;
}

.back-to-top.in-sidebar .read-progress {
  font-size: 15px;
  order: 2;
}

.back-to-top.in-sidebar .arrow-icon {
  margin-top: 0;
  order: 1;
}

@keyframes gradientAnimation {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

/* 添加箭头动画 */
@keyframes bounce {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-3px);
  }
}

.back-to-top:hover .arrow-icon {
  animation: bounce 1s infinite;
}
</style>
