<template>
  <div>
    <!-- banner -->
    <div class="category-banner banner">
      <h1 class="banner-title">分类</h1>
    </div>
    <!-- 分类列表 -->
    <v-card class="blog-container category-container">
      <div class="category-header">
        <v-icon large color="#49b1f5" class="category-icon"
          >mdi-tag-multiple</v-icon
        >
        <div class="category-title">
          目前共计 <span class="category-count-number">{{ count }}</span> 个分类
        </div>
      </div>

      <div class="category-cloud">
        <router-link
          v-for="item of categoryList"
          :key="item.id"
          :to="'/categories/' + item.id"
          class="category-item"
          :style="{
            'font-size': calcSize(item.articleCount || 0) + 'rem',
            color: randomColor(),
            'background-color': randomBgColor()
          }"
        >
          <v-icon small class="category-item-icon">mdi-pound</v-icon>
          {{ item.categoryName }}
          <span class="category-item-count"
            >({{ item.articleCount || 0 }})</span
          >
        </router-link>
      </div>

      <div class="category-list-container">
        <div class="category-list-header">
          <v-icon color="#49b1f5">mdi-format-list-bulleted</v-icon>
          <span>分类列表</span>
        </div>
        <ul class="category-list">
          <li
            class="category-list-item"
            v-for="item of categoryList"
            :key="item.id"
          >
            <router-link :to="{ name: 'CategoryArticles', params: { categoryId: item.id } }">
              {{ item.categoryName }}
              <span class="category-count">({{ item.articleCount || 0 }})</span>
            </router-link>
          </li>
        </ul>
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
    this.listCategories();
  },
  data: function() {
    return {
      categoryList: [],
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
      ]
    };
  },
  methods: {
    listCategories() {
      this.axios.get("/api/categories").then(({ data }) => {
        this.categoryList = data.data.recordList.map(category => ({
          ...category,
          articleCount: category.articleCount || 0
        }));
        this.count = data.data.count;
      });
    },
    // 根据文章数量计算字体大小
    calcSize(count) {
      const baseSize = 1.0;
      const maxCount = Math.max(
        ...this.categoryList.map(item => item.articleCount || 0)
      );
      if (maxCount === 0) return baseSize;
      const size = baseSize + (count / maxCount) * 0.6;
      return Math.min(Math.max(size, 1.0), 1.6); // 限制范围在1.0~1.6之间
    },
    // 随机颜色
    randomColor() {
      return this.colors[Math.floor(Math.random() * this.colors.length)];
    },
    // 随机背景色
    randomBgColor() {
      const color = this.randomColor();
      return color + "15"; // 添加透明度
    }
  }
};
</script>

<style scoped>
.category-banner {
  background: url("@/assets/img/6.jpg") center
    center / cover no-repeat;
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

.category-container {
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  margin-top: -3rem;
  background: #fff;
  z-index: 2;
  position: relative;
}

.category-header {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px dashed rgba(73, 177, 245, 0.3);
}

.category-icon {
  margin-right: 1rem;
  opacity: 0.8;
}

.category-title {
  font-size: 1.5rem;
  color: #555;
  text-align: center;
}

.category-count-number {
  font-size: 1.8rem;
  font-weight: bold;
  color: #49b1f5;
  margin: 0 0.3rem;
}

/* 标签云 */
.category-cloud {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  padding: 1rem;
  margin-bottom: 2rem;
}

.category-item {
  display: inline-flex;
  align-items: center;
  padding: 0.5rem 1rem;
  margin: 0.5rem;
  border-radius: 3rem;
  text-decoration: none;
  transition: all 0.3s;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.category-item:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.category-item-icon {
  margin-right: 0.3rem;
  font-size: 0.9rem;
}

.category-item-count {
  margin-left: 0.3rem;
  font-size: 0.8rem;
  opacity: 0.7;
}

/* 分类列表 */
.category-list-container {
  background: #f9f9f9;
  padding: 1.5rem;
  border-radius: 8px;
}

.category-list-header {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  font-size: 1.3rem;
  font-weight: 500;
  color: #49b1f5;
}

.category-list-header .v-icon {
  margin-right: 0.5rem;
}

.category-list {
  margin: 0 1.8rem;
  list-style: none;
}

.category-list-item {
  padding: 10px 1.8rem 10px 0;
  border-bottom: 1px dashed rgba(0, 0, 0, 0.06);
  transition: all 0.3s;
}

.category-list-item:last-child {
  border-bottom: none;
}

.category-list-item:before {
  display: inline-block;
  position: relative;
  left: -0.75rem;
  width: 12px;
  height: 12px;
  border: 0.2rem solid #49b1f5;
  border-radius: 50%;
  background: #fff;
  content: "";
  transition-duration: 0.3s;
}

.category-list-item:hover {
  background-color: rgba(73, 177, 245, 0.05);
  transform: translateX(5px);
}

.category-list-item:hover:before {
  border: 0.2rem solid #ff7242;
}

.category-list-item a {
  color: #555;
  text-decoration: none;
  font-size: 1.1rem;
  transition: all 0.3s;
}

.category-list-item a:hover {
  color: #49b1f5;
}

.category-count {
  margin-left: 0.5rem;
  font-size: 0.85rem;
  color: #858585;
}

@media (max-width: 759px) {
  .category-container {
    padding: 1.5rem;
  }

  .category-title {
    font-size: 1.2rem;
  }

  .category-count-number {
    font-size: 1.5rem;
  }

  .category-cloud {
    padding: 0.5rem;
  }

  .category-item {
    padding: 0.4rem 0.8rem;
    margin: 0.3rem;
  }

  .category-list-container {
    padding: 1rem;
  }

  .category-list-header {
    font-size: 1.1rem;
  }

  .category-list-item a {
    font-size: 1rem;
  }
}
</style>
