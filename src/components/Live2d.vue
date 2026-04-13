<template>
  <div class="live2d-container"></div>
</template>

<script>
export default {
  name: "Live2d",
  mounted() {
    // 加载自定义配置
    this.loadScript("/live2d-widget/autoload.js");

    // 确保看板娘位置正确
    setTimeout(() => {
      const waifu = document.querySelector("#waifu");
      if (waifu) {
        waifu.style.right = "50px";
        waifu.style.left = "auto";
        waifu.style.top = "50%";
        waifu.style.bottom = "auto";
        waifu.style.transform = "translateY(-50%)";
      }
    }, 1000);
  },
  methods: {
    loadScript(url) {
      const script = document.createElement("script");
      script.src = url;
      script.async = true;
      document.body.appendChild(script);
    }
  }
};
</script>

<style scoped>
.live2d-container {
  position: fixed;
  top: 50%;
  transform: translateY(-50%);
  width: 280px;
  height: 250px;
  z-index: 999;
}

:deep(#waifu) {
  position: fixed !important;
  left: auto !important;
  right: 50px !important;
  top: 50% !important;
  bottom: auto !important;
  transform: translateY(-50%) !important;
  margin: 0 !important;
}

:deep(#waifu-tool) {
  right: 50px !important;
  left: auto !important;
}

:deep(#live2d) {
  position: relative !important;
}
</style>
