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
:deep(.aplayer.aplayer-fixed) {
  left: 16px !important;
  right: auto !important;
  bottom: 16px !important;
  z-index: 9999 !important;
}

:deep(.aplayer.aplayer-fixed .aplayer-body) {
  left: 0 !important;
  right: auto !important;
  bottom: 0 !important;
  background: transparent !important;
}

:deep(.aplayer-miniswitcher) {
  background: #607d8b !important;
}

:deep(.aplayer-lrc) {
  position: fixed !important;
  bottom: 0 !important;
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
