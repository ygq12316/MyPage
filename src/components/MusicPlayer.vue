<template>
  <div class="music-player-container">
    <!--
      使用 MetingJS Web Component（CDN 已在 public/index.html 中加载）
      server: 音乐平台 netease / tencent / kugou
      type:   song / playlist / album / artist
      id:     对应歌单/歌曲 ID
      如需更换歌单，只需修改 id 属性即可
    -->
    <meting-js
      server="netease"
      type="playlist"
      id="7452754810"
      mutex="true"
      mini="true"
      fixed="true"
      list-folded="true"
      volume="0.7"
      theme="#607d8b"
    ></meting-js>
  </div>
</template>

<script>
export default {
  name: "MusicPlayer",
  mounted() {
    this.checkMetingReady();
  },
  methods: {
    checkMetingReady() {
      const maxAttempts = 20;
      let attempts = 0;

      const timer = setInterval(() => {
        attempts += 1;
        const metingDefined =
          typeof window !== "undefined" &&
          window.customElements &&
          window.customElements.get("meting-js");

        if (metingDefined) {
          clearInterval(timer);
          return;
        }

        if (attempts >= maxAttempts) {
          clearInterval(timer);
          if (this.$toast) {
            this.$toast({
              type: "warning",
              message: "音乐组件加载失败，请检查网络或 CDN 可用性"
            });
          }
        }
      }, 300);
    }
  }
};
</script>

<style scoped>
.music-player-container {
  width: 100%;
}

/* 确保 APlayer 容器正确显示 */
:deep(.aplayer) {
  z-index: 9999 !important;
}

/* 固定模式样式 */
:deep(.aplayer.aplayer-fixed) {
  position: fixed !important;
  bottom: 0 !important;
  left: 0 !important;
  max-width: 100% !important;
  z-index: 9999 !important;
}

:deep(.aplayer.aplayer-fixed .aplayer-body) {
  position: fixed !important;
  bottom: 0 !important;
  left: 0 !important;
}

/* 迷你模式 */
:deep(.aplayer.aplayer-fixed.aplayer-narrow) {
  width: auto !important;
  max-width: 400px !important;
}

/* 迷你开关按钮 */
:deep(.aplayer-miniswitcher) {
  background: #607d8b !important;
}

/* 歌词显示 */
:deep(.aplayer-lrc) {
  position: fixed !important;
  bottom: 60px !important;
  left: 50% !important;
  transform: translateX(-50%) !important;
  width: calc(100% - 20px) !important;
  max-width: 680px !important;
  text-align: center !important;
  z-index: 9998 !important;
  pointer-events: none !important;
}

:deep(.aplayer-lrc p) {
  font-size: 13px !important;
  color: #666 !important;
}

:deep(.aplayer-lrc .aplayer-lrc-current) {
  color: #607d8b !important;
  font-size: 13px !important;
  font-weight: bold !important;
}
</style>
