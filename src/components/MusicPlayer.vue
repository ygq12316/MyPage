<template>
  <div id="musicPlayer" class="music-player-container"></div>
</template>

<script>
export default {
  name: "MusicPlayer",
  mounted() {
    this.initPlayer();
  },
  methods: {
    initPlayer() {
      if (typeof APlayer !== 'undefined') {
        const ap = new APlayer({
          container: document.getElementById('musicPlayer'),
          fixed: true,
          mini: true,
          autoplay: false,
          theme: '#607d8b',
          loop: 'all',
          order: 'list',
          preload: 'auto',
          volume: 0.7,
          mutex: true,
          audio: [
            {
              name: '起风了',
              artist: '买辣椒也用券',
              url: 'https://music.163.com/song/media/outer/url?id=1330348068.mp3',
              cover: 'https://p1.music.126.net/6QYQfNBM4xgTJp3HjJ3j3A==/109951163720482466.jpg?param=300x300'
            },
            {
              name: '晴天',
              artist: '周杰伦',
              url: 'https://music.163.com/song/media/outer/url?id=186016.mp3',
              cover: 'https://p1.music.126.net/NxN7Q7xw8Wc58SUgYG3PaA==/109951165882341897.jpg?param=300x300'
            }
          ]
        });
      }
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
