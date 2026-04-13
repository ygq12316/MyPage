<template>
  <div>
    <div class="about-banner banner">
      <h1 class="banner-title">关于我</h1>
    </div>
    <v-card class="blog-container about-container">
      <div v-if="aboutContent" class="markdown-body" v-html="renderMarkdown(aboutContent)" />
      <div v-else class="empty-text">暂无内容，请在后台“关于我”中编辑。</div>
    </v-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      aboutContent: ""
    };
  },
  created() {
    this.getAbout();
  },
  methods: {
    getAbout() {
      this.axios.get("/api/about").then(({ data }) => {
        this.aboutContent = data.data || "";
      });
    },
    renderMarkdown(content) {
      let md = require("markdown-it")();
      return md.render(content || "");
    }
  }
};
</script>

<style scoped>
.about-banner {
  background: url("@/assets/img/6.jpg") center center / cover no-repeat;
  background-color: #49b1f5;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 300px;
}

.banner-title {
  color: #fff;
  font-size: 36px;
  font-weight: 700;
  text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.3);
}

.about-container {
  min-height: 240px;
  margin-top: 2rem;
  margin-bottom: 2rem;
  padding: 2rem;
}

.empty-text {
  color: var(--grey-6);
  text-align: center;
  line-height: 240px;
}
</style>
