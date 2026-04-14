<template>
  <div class="music-player">
    <meting-js
      server="tencent"
      type="playlist"
      id="9680852022"
      fixed="true"
      mini="true"
      autoplay="false"
      theme="#607d8b"
      loop="all"
      order="random"
      preload="auto"
      volume="0.7"
      mutex="true"
      list-folded="true"
      list-max-height="340px"
      storage-name="metingjs"
    ></meting-js>
  </div>
</template>

<script>
export default {
  name: "MusicPlayer"
};
</script>

<style scoped>
/* 基础定位样式 */
:deep(.aplayer.aplayer-fixed) {
  max-width: 400px;
  left: 0;
  bottom: 0;
}

:deep(.aplayer.aplayer-fixed .aplayer-body) {
  position: fixed;
  left: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
}

/* 迷你模式样式 */
:deep(.aplayer.aplayer-fixed.aplayer-narrow) {
  left: 0;
  bottom: 0;
}

/* 迷你开关按钮样式 */
:deep(.aplayer-miniswitcher) {
  background: #607d8b;
}

/* 歌词显示样式 */
:deep(.aplayer-lrc) {
  position: fixed !important;
  bottom: 0px !important;
  left: 50% !important;
  transform: translate(-50%, -50%) !important;
  width: 100% !important;
  max-width: 680px !important;
  text-align: center !important;
  z-index: 998 !important;
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
