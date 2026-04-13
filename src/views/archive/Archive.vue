<template>
  <div>
    <!-- banner -->
    <div class="archive-banner banner">
      <h1 class="banner-title">归档</h1>
    </div>
    <!-- 归档列表 -->
    <v-card class="blog-container archive-container">
      <div class="archive-header">
        <div class="archive-counter">
          <v-icon large color="#49b1f5" class="counter-icon">
            mdi-text-box-multiple
          </v-icon>
          <div class="counter-text">
            <span class="counter-number">{{ count }}</span>
            <span class="counter-label">篇文章</span>
          </div>
        </div>
        <div class="archive-description">
          还行！目前共计 {{ count }} 篇日志。继续努力。
        </div>
      </div>

      <div class="archive-articles-title">
        <v-icon class="icon">mdi-notebook-multiple</v-icon>
        <span class="text">文章列表</span>
      </div>

      <div class="timeline-container">
        <div v-if="archiveList.length" class="vertical-line"></div>

        <div
          v-for="(group, year) in groupedArticles"
          :key="year"
          class="year-group"
        >
          <div class="year-node"></div>
          <div class="year-label">{{ year }}</div>

          <div class="article-items">
            <div
              v-for="article in group"
              :key="article.id"
              class="article-item"
            >
              <div class="date-node"></div>
              <div class="date-label">
                {{ formatDateLabel(article.createTime) }}
              </div>
              <router-link
                :to="'/articles/' + article.id"
                class="article-title"
              >
                {{ article.articleTitle }}
              </router-link>
            </div>
          </div>
        </div>
      </div>

      <!-- 分页按钮 -->
      <div class="pagination-container">
        <v-pagination
          color="#49b1f5"
          v-model="current"
          :length="Math.ceil(count / 10)"
          total-visible="7"
          class="custom-pagination"
        />
      </div>
    </v-card>
  </div>
</template>

<script>
export default {
  created() {
    this.listArchives();
  },
  data: function() {
    return {
      current: 1,
      count: 0,
      archiveList: []
    };
  },
  computed: {
    groupedArticles() {
      // 按年份分组文章
      const grouped = {};
      this.archiveList.forEach(article => {
        const date = new Date(article.createTime);
        const year = date.getFullYear();

        if (!grouped[year]) {
          grouped[year] = [];
        }

        grouped[year].push(article);
      });

      // 按时间倒序排列
      Object.keys(grouped).forEach(year => {
        grouped[year].sort(
          (a, b) => new Date(b.createTime) - new Date(a.createTime)
        );
      });

      return grouped;
    }
  },
  methods: {
    listArchives() {
      this.axios
        .get("/api/articles/archives", {
          params: { current: this.current }
        })
        .then(({ data }) => {
          this.archiveList = data.data.recordList;
          this.count = data.data.count;
        });
    },
    formatDateLabel(dateString) {
      const date = new Date(dateString);
      const month = date.getMonth() + 1;
      const day = date.getDate();
      return `${month.toString().padStart(2, "0")}-${day
        .toString()
        .padStart(2, "0")}`;
    }
  },
  watch: {
    current(value) {
      this.axios
        .get("/api/articles/archives", {
          params: { current: value }
        })
        .then(({ data }) => {
          this.archiveList = data.data.recordList;
          this.count = data.data.count;
        });
    }
  },
  filters: {
    date(value) {
      return value ? value.split("T")[0].replace(/-/g, "-") : "";
    }
  }
};
</script>

<style scoped>
.archive-banner {
  background: url("@/assets/img/6.jpg")
    center center / cover no-repeat;
  background-color: #49b1f5;
  position: relative;
  height: 300px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 2rem;
}

.banner-title {
  font-size: 2.5rem;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  font-weight: bold;
  color: #fff;
  z-index: 1;
}

.archive-container {
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  position: relative;
  margin-top: -3rem;
  background-color: #fff;
  z-index: 2;
}

.archive-header {
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px dashed rgba(73, 177, 245, 0.3);
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}

.archive-counter {
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
}

.counter-icon {
  margin-right: 1rem;
  opacity: 0.8;
}

.counter-text {
  display: flex;
  align-items: baseline;
}

.counter-number {
  font-size: 2.5rem;
  font-weight: bold;
  color: #49b1f5;
  margin-right: 0.5rem;
  font-family: "DIN Condensed", Arial, sans-serif;
}

.counter-label {
  font-size: 1.2rem;
  color: #666;
}

.archive-description {
  font-size: 1rem;
  color: #777;
  margin-top: 0.5rem;
}

.archive-articles-title {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
}

.archive-articles-title .icon {
  color: #49b1f5;
  margin-right: 0.5rem;
  font-size: 1.8rem;
}

.archive-articles-title .text {
  font-size: 1.5rem;
  color: #49b1f5;
  font-weight: bold;
}

.timeline-container {
  position: relative;
  padding: 1rem 0 1rem 2rem;
  min-height: 300px;
}

.vertical-line {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 2px;
  background-color: #e0e0e0;
}

.year-group {
  position: relative;
  margin-bottom: 3rem;
}

.year-node {
  position: absolute;
  left: -2.5rem;
  top: 0;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background-color: #fff;
  border: 3px solid #49b1f5;
  z-index: 2;
}

.year-label {
  font-size: 1.8rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 1.5rem;
  position: relative;
}

.article-items {
  padding-left: 1.5rem;
  position: relative;
}

.article-item {
  position: relative;
  margin-bottom: 1.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px dashed rgba(0, 0, 0, 0.06);
}

.article-item:last-child {
  border-bottom: none;
}

.date-node {
  position: absolute;
  left: -2rem;
  top: 0.5rem;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: #49b1f5;
  opacity: 0.7;
}

.date-label {
  font-size: 0.9rem;
  color: #888;
  margin-bottom: 0.5rem;
  font-family: "DIN Condensed", Arial, sans-serif;
  display: inline-block;
  min-width: 3.5rem;
}

.article-title {
  color: #555;
  text-decoration: none;
  font-size: 1.1rem;
  position: relative;
  transition: all 0.3s ease;
  padding: 0.3rem 0;
  font-weight: 500;
  margin-left: 1rem;
}

.article-title:hover {
  color: #49b1f5;
  padding-left: 0.5rem;
}

.article-title::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 1px;
  background-color: #49b1f5;
  transition: width 0.3s ease;
}

.article-title:hover::after {
  width: 100%;
}

.pagination-container {
  margin-top: 2rem;
  display: flex;
  justify-content: center;
}

.custom-pagination {
  box-shadow: 0 2px 12px rgba(73, 177, 245, 0.1);
  border-radius: 30px;
  padding: 0.3rem 1rem;
  background-color: #f9f9f9;
}

/* 响应式调整 */
@media (max-width: 600px) {
  .archive-container {
    padding: 1.5rem;
  }

  .timeline-container {
    padding-left: 1rem;
  }

  .year-node {
    left: -1.5rem;
    width: 12px;
    height: 12px;
  }

  .date-node {
    left: -1.5rem;
    width: 8px;
    height: 8px;
  }

  .banner-title {
    font-size: 2rem;
  }

  .counter-number {
    font-size: 2rem;
  }

  .counter-label {
    font-size: 1rem;
  }

  .year-label {
    font-size: 1.5rem;
  }

  .article-title {
    font-size: 1rem;
  }
}

/* 深色模式样式调整 */
.theme--dark .archive-container,
[data-theme='dark'] .archive-container,
body.theme-dark .archive-container {
  background-color: #1e1e1e;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

/* 年份标签在深色模式下使用白色 */
.theme--dark .year-label,
[data-theme='dark'] .year-label,
body.theme-dark .year-label {
  color: #ffffff;
}

/* 文章标题在深色模式下的颜色 */
.theme--dark .article-title,
[data-theme='dark'] .article-title,
body.theme-dark .article-title {
  color: #e0e0e0;
}

.theme--dark .article-title:hover,
[data-theme='dark'] .article-title:hover,
body.theme-dark .article-title:hover {
  color: #49b1f5;
}

/* 计数器标签在深色模式下 */
.theme--dark .counter-label,
[data-theme='dark'] .counter-label,
body.theme-dark .counter-label {
  color: #b0b0b0;
}

/* 归档描述在深色模式下 */
.theme--dark .archive-description,
[data-theme='dark'] .archive-description,
body.theme-dark .archive-description {
  color: #cccccc;
}

/* 日期标签在深色模式下 */
.theme--dark .date-label,
[data-theme='dark'] .date-label,
body.theme-dark .date-label {
  color: #aaaaaa;
}

/* 垂直线在深色模式下 */
.theme--dark .vertical-line,
[data-theme='dark'] .vertical-line,
body.theme-dark .vertical-line {
  background-color: #444444;
}

/* 文章项底部边框 */
.theme--dark .article-item,
[data-theme='dark'] .article-item,
body.theme-dark .article-item {
  border-bottom-color: rgba(255, 255, 255, 0.06);
}

/* 分页容器背景 */
.theme--dark .custom-pagination,
[data-theme='dark'] .custom-pagination,
body.theme-dark .custom-pagination {
  background-color: #2c2c2c;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.3);
}
</style>
