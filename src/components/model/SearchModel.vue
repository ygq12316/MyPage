<template>
  <!-- 搜索框 -->
  <v-dialog v-model="searchFlag" max-width="600" :fullscreen="isMobile" overlay-opacity="0.7">
    <v-card class="search-wrapper" style="border-radius:4px">
      <div class="mb-3">
        <span class="search-title">本地搜索</span>
        <!-- 关闭按钮 -->
        <v-icon class="float-right" @click="searchFlag = false">
          mdi-close
        </v-icon>
      </div>
      <!-- 输入框 -->
      <div class="search-input-wrapper">
        <v-icon>mdi-magnify</v-icon>
        <input v-model="keywords" placeholder="输入文章标题或内容..." />
      </div>
      <!-- 搜索结果 -->
      <div class="search-result-wrapper">
        <hr class="divider" />
        <ul>
          <li class="search-reslut" v-for="item of articleList" :key="item.id">
            <!-- 文章标题 -->
            <a @click="goTo(item.id)" v-html="item.articleTitle" />
            <!-- 文章内容 -->
            <p
              class="search-reslut-content text-justify"
              v-html="item.articleContent"
            />
          </li>
        </ul>
        <!-- 搜索结果不存在提示 -->
        <div
          v-show="flag && articleList.length == 0"
          style="font-size:0.875rem"
        >
          找不到您查询的内容：{{ keywords }}
        </div>
      </div>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  data: function() {
    return {
      keywords: "",
      articleList: [],
      flag: false
    };
  },
  methods: {
    goTo(articleId) {
      this.$store.state.searchFlag = false;
      this.$router.push({ path: "/articles/" + articleId });
    }
  },
  computed: {
    searchFlag: {
      set(value) {
        this.$store.state.searchFlag = value;
      },
      get() {
        return this.$store.state.searchFlag;
      }
    },
    isMobile() {
      const clientWidth = document.documentElement.clientWidth;
      if (clientWidth > 960) {
        return false;
      }
      return true;
    }
  },
  watch: {
    keywords(value) {
      this.flag = value.trim() != "" ? true : false;
      this.axios
        .get("/api/articles/search", {
          params: { current: 1, keywords: value }
        })
        .then(({ data }) => {
          this.articleList = data.data;
        });
    }
  }
};
</script>

<style scoped>
.search-wrapper {
  padding: 1.25rem;
  height: 100%;
  background: #fff;
}

.search-title {
  color: #49b1f5;
  font-size: 1.25rem;
  line-height: 1;
}

.search-input-wrapper {
  display: flex;
  padding: 5px;
  height: 35px;
  width: 100%;
  border: 2px solid #8e8cd8;
  border-radius: 2rem;
}

.search-input-wrapper input {
  width: 100%;
  margin-left: 5px;
  outline: none;
}

@media (min-width: 960px) {
  .search-result-wrapper {
    padding-right: 5px;
    height: 450px;
    overflow: auto;
  }
}

@media (max-width: 959px) {
  .search-result-wrapper {
    height: calc(100vh - 110px);
    overflow: auto;
  }
}

.search-reslut a {
  color: #555;
  font-weight: bold;
  border-bottom: 1px solid #999;
  text-decoration: none;
}

.search-reslut-content {
  color: #555;
  cursor: pointer;
  border-bottom: 1px dashed #ccc;
  padding: 5px 0;
  line-height: 2;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}

.divider {
  margin: 20px 0;
  border: 2px dashed #d2ebfd;
}

/* 深色模式样式 */
.theme--dark .search-wrapper,
[data-theme='dark'] .search-wrapper,
body.theme-dark .search-wrapper {
  background-color: #1e1e1e !important;
  color: #ffffff;
}

.theme--dark .search-input-wrapper,
[data-theme='dark'] .search-input-wrapper,
body.theme-dark .search-input-wrapper {
  border-color: #8e8cd8;
}

.theme--dark .search-input-wrapper input,
[data-theme='dark'] .search-input-wrapper input,
body.theme-dark .search-input-wrapper input {
  background-color: transparent;
  color: #ffffff;
}

.theme--dark .search-reslut a,
[data-theme='dark'] .search-reslut a,
body.theme-dark .search-reslut a {
  color: #ffffff;
  border-bottom-color: #666;
}

.theme--dark .search-reslut-content,
[data-theme='dark'] .search-reslut-content,
body.theme-dark .search-reslut-content {
  color: #cccccc;
  border-bottom-color: #444;
}

.theme--dark .divider,
[data-theme='dark'] .divider,
body.theme-dark .divider {
  border-color: #444;
}

/* 修复对话框样式 - 更精确地控制遮罩层 */
.theme--dark.v-application .v-dialog__overlay,
[data-theme='dark'] .v-dialog__overlay,
body.theme-dark .v-dialog__overlay {
  background-color: transparent !important;
}

/* 修复对话框内容区域，确保它不会有全屏黑色背景 */
.theme--dark.v-application .v-dialog__content,
[data-theme='dark'] .v-dialog__content,
body.theme-dark .v-dialog__content {
  background-color: transparent !important;
  box-shadow: none !important;
}

/* 修改遮罩层的颜色和透明度 */
.theme--dark.v-overlay .v-overlay__scrim,
[data-theme='dark'] .v-overlay .v-overlay__scrim,
body.theme-dark .v-overlay .v-overlay__scrim {
  background-color: rgba(0, 0, 0, 0.5) !important; /* 降低透明度 */
}

/* 在深色模式下，让v-dialog组件本身是透明的 */
.theme--dark .v-dialog,
[data-theme='dark'] .v-dialog,
body.theme-dark .v-dialog {
  background-color: transparent !important;
  box-shadow: none !important;
}

/* 确保深色模式下弹窗内容区域的背景色正确 */
.theme--dark .v-card.search-wrapper,
[data-theme='dark'] .v-card.search-wrapper,
body.theme-dark .v-card.search-wrapper {
  background-color: #1e1e1e !important;
  color: #ffffff !important;
}

/* 确保滚动条在深色模式下可见 */
.theme--dark .search-result-wrapper::-webkit-scrollbar-track,
[data-theme='dark'] .search-result-wrapper::-webkit-scrollbar-track,
body.theme-dark .search-result-wrapper::-webkit-scrollbar-track {
  background-color: #333 !important;
}

.theme--dark .search-result-wrapper::-webkit-scrollbar-thumb,
[data-theme='dark'] .search-result-wrapper::-webkit-scrollbar-thumb,
body.theme-dark .search-result-wrapper::-webkit-scrollbar-thumb {
  background-color: #666 !important;
}
</style>
