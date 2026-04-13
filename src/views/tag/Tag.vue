<template>
  <div>
    <!-- banner -->
    <div class="tag-banner banner">
      <h1 class="banner-title">标签</h1>
    </div>
    <!-- 标签列表 -->
    <v-card class="blog-container tag-container">
      <div class="tag-header">
        <div class="tag-title-icon">
          <v-icon large color="#49b1f5">mdi-tag-multiple-outline</v-icon>
        </div>
        <div class="tag-title-text">
          目前共计 <span class="tag-count-number">{{ count }}</span> 个标签
        </div>
      </div>

      <!-- 标签云 -->
      <div class="tag-cloud-wrapper">
        <div class="tag-cloud">
          <router-link
            v-for="item of tagList"
            :key="item.id"
            :to="'/tags/' + item.id"
            class="tag-item"
            :style="getTagStyle(item)"
          >
            <v-icon small class="tag-item-icon">mdi-pound</v-icon>
            {{ item.tagName }}
          </router-link>
        </div>
      </div>
    </v-card>
  </div>
</template>

<script>
import InfiniteLoading from "vue-infinite-loading";

export default {
  components: {
    InfiniteLoading
  },
  created() {
    this.listTags();
    this.initializeColors();
  },
  data: function() {
    return {
      tagList: [],
      count: 0,
      colors: [
        "#49b1f5",
        "#ff7242",
        "#13ce66",
        "#409eff",
        "#fe9900",
        "#8e8cd8",
        "#835af1",
        "#ff4949",
        "#fc6423"
      ],
      colorMap: {},
      maxFontSize: 2.2,
      minFontSize: 1.1
    };
  },
  methods: {
    listTags() {
      this.axios.get("/api/tags").then(({ data }) => {
        this.tagList = data.data.recordList;
        this.count = data.data.count;
      });
    },
    // 初始化颜色映射
    initializeColors() {
      this.colorMap = {};
    },
    // 获取标签颜色
    getTagColor(tagId) {
      if (!this.colorMap[tagId]) {
        this.colorMap[tagId] = this.colors[
          Math.floor(Math.random() * this.colors.length)
        ];
      }
      return this.colorMap[tagId];
    },
    // 获取标签样式
    getTagStyle(item) {
      const color = this.getTagColor(item.id);
      const size = this.getRandomSize();
      return {
        "font-size": size + "rem",
        color: color,
        "background-color": color + "15",
        transform: `rotate(${Math.floor(Math.random() * 30) - 15}deg)`,
        "animation-delay": `${Math.random() * 2}s`
      };
    },
    // 获取随机大小
    getRandomSize() {
      return (
        Math.random() * (this.maxFontSize - this.minFontSize) +
        this.minFontSize
      ).toFixed(1);
    },
    // 导航到标签页面
    navigateToTag(tagId) {
      this.$router.push("/api/tags/" + tagId);
    }
  }
};
</script>

<style scoped>
.tag-banner {
  background: url("@/assets/img/6.jpg") center center /
    cover no-repeat;
  background-color: #49b1f5;
  height: 300px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}

.banner-title {
  font-size: 2.5rem;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  font-weight: bold;
  color: #fff;
  z-index: 1;
}

.tag-container {
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  margin-top: -3rem;
  background: #fff;
  z-index: 2;
  position: relative;
}

.tag-header {
  text-align: center;
  margin-bottom: 2rem;
}

.tag-title-icon {
  margin-bottom: 0.5rem;
}

.tag-title-text {
  font-size: 1.5rem;
  color: #555;
}

.tag-count-number {
  font-size: 1.8rem;
  font-weight: bold;
  color: #49b1f5;
  margin: 0 0.3rem;
}

/* 标签云 */
.tag-cloud-wrapper {
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 2rem;
  margin-bottom: 2rem;
  min-height: 200px;
}

.tag-cloud {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
}

.tag-item {
  display: inline-flex;
  align-items: center;
  padding: 0.5rem 1rem;
  margin: 0.8rem;
  border-radius: 3rem;
  text-decoration: none;
  transition: all 0.5s;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  position: relative;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-10px) rotate(5deg);
  }
}

.tag-item:hover {
  transform: scale(1.15) !important;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  z-index: 10;
}

.tag-item-icon {
  margin-right: 0.3rem;
  font-size: 0.9rem;
}

/* 分隔线 */
.tag-divider {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 2rem 0;
  position: relative;
}

.tag-divider:before,
.tag-divider:after {
  content: "";
  height: 1px;
  background: #eee;
  flex: 1;
}

.divider-icon {
  margin: 0 1rem;
  color: #49b1f5;
}

.divider-text {
  margin: 0 0.5rem;
  font-size: 1.3rem;
  color: #49b1f5;
  font-weight: 500;
}

/* 标签列表 */
.tag-list-container {
  padding: 1rem 0;
}

.tag-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.8rem;
}

.tag-list-item {
  cursor: pointer;
  transition: all 0.3s;
  font-size: 1rem;
}

.tag-list-item:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

@media (max-width: 759px) {
  .tag-container {
    padding: 1.5rem;
  }

  .tag-title-text {
    font-size: 1.2rem;
  }

  .tag-count-number {
    font-size: 1.5rem;
  }

  .tag-cloud-wrapper {
    padding: 1rem;
  }

  .tag-item {
    padding: 0.4rem 0.8rem;
    margin: 0.5rem;
  }

  .divider-text {
    font-size: 1.1rem;
  }
}
</style>
