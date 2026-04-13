<template>
  <div class="music-player-container">
    <div ref="player"></div>
  </div>
</template>

<script>
export default {
  name: "MusicPlayer",
  data() {
    return {
      player: null
    };
  },
  mounted() {
    this.initPlayer();
  },
  beforeDestroy() {
    if (this.player && typeof this.player.destroy === "function") {
      this.player.destroy();
      this.player = null;
    }
  },
  methods: {
    async initPlayer() {
      try {
        await this.ensureAPlayerReady();
        this.player = new window.APlayer({
          container: this.$refs.player,
          fixed: true,
          mini: true,
          listFolded: true,
          autoplay: false,
          mutex: true,
          theme: "#607d8b",
          loop: "all",
          order: "list",
          preload: "auto",
          volume: 0.7,
          audio: [
            {
              name: "SoundHelix Song 1",
              artist: "SoundHelix",
              url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
              cover: "https://picsum.photos/seed/music1/300/300"
            },
            {
              name: "SoundHelix Song 2",
              artist: "SoundHelix",
              url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
              cover: "https://picsum.photos/seed/music2/300/300"
            }
          ]
        });
      } catch (error) {
        if (this.$toast) {
          this.$toast({
            type: "warning",
            message: "音乐播放器加载失败，请检查网络或 CDN"
          });
        }
      }
    },
    ensureAPlayerReady() {
      if (typeof window !== "undefined" && window.APlayer) {
        return Promise.resolve();
      }
      return this.loadScript("https://cdn.jsdelivr.net/npm/aplayer@1.10.1/dist/APlayer.min.js")
        .catch(() => this.loadScript("https://unpkg.com/aplayer@1.10.1/dist/APlayer.min.js"));
    },
    loadScript(src) {
      return new Promise((resolve, reject) => {
        const existing = Array.from(document.getElementsByTagName("script")).find((s) => s.src === src);
        if (existing) {
          if (typeof window !== "undefined" && window.APlayer) {
            resolve();
          } else {
            existing.addEventListener("load", resolve, { once: true });
            existing.addEventListener("error", reject, { once: true });
          }
          return;
        }

        const script = document.createElement("script");
        script.src = src;
        script.async = true;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
        document.head.appendChild(script);
      });
    }
  }
};
</script>

<style scoped>
.music-player-container {
  width: 100%;
}

:deep(.aplayer) {
  z-index: 9999 !important;
}

:deep(.aplayer.aplayer-fixed) {
  position: fixed !important;
  left: 16px !important;
  right: auto !important;
  bottom: 16px !important;
  width: 320px !important;
  max-width: 320px !important;
  z-index: 9999 !important;
}

:deep(.aplayer.aplayer-fixed .aplayer-body) {
  position: fixed !important;
  left: 16px !important;
  right: auto !important;
  bottom: 16px !important;
  width: 320px !important;
}

:deep(.aplayer.aplayer-fixed.aplayer-narrow) {
  width: 320px !important;
  max-width: 320px !important;
}

:deep(.aplayer-miniswitcher) {
  background: #607d8b !important;
}

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
