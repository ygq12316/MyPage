<template>
  <div class="favorites-container">
    <!-- 页面标题和描述 -->
    <div class="page-header">
      <h1 class="page-title">我的收藏</h1>
      <div class="page-description">
        <p>这里收集了一些日常使用的优质网站和工具，希望对你也有所帮助</p>
      </div>
    </div>

    <!-- 分类导航栏 -->
    <div class="category-nav">
      <v-chip-group
        v-model="selectedCategory"
        active-class="category-active"
      >
        <v-chip
          v-for="category in categories"
          :key="category.id"
          :value="category.id"
          outlined
          pill
        >
          <v-icon left size="18">{{ category.icon }}</v-icon>
          {{ category.name }}
        </v-chip>
      </v-chip-group>
    </div>

    <!-- 网站列表 -->
    <v-row class="website-grid">
      <!-- 加载中状态 -->
      <v-col v-if="loading" cols="12" class="text-center">
        <v-progress-circular
          indeterminate
          color="#49b1f5"
          size="50"
        ></v-progress-circular>
        <p class="mt-3">正在加载收藏网站...</p>
      </v-col>
      
      <!-- 无数据提示 -->
      <v-col v-else-if="filteredWebsites.length === 0" cols="12" class="text-center">
        <v-icon size="60" color="#c0c0c0">mdi-bookmark-off-outline</v-icon>
        <p class="mt-3">暂无收藏网站</p>
      </v-col>
      
      <!-- 网站卡片 -->
      <v-col
        v-else
        v-for="website in filteredWebsites"
        :key="website.id"
        cols="12"
        sm="6"
        md="3"
        lg="2"
      >
        <v-card
          class="website-card"
          :href="website.url"
          target="_blank"
          rel="noopener noreferrer"
          elevation="0"
        >
          <div class="website-icon">
            <img 
              v-if="website.icon" 
              :src="website.icon" 
              :alt="website.name" 
              class="icon-img"
              @error="handleImageError"
            />
            <img 
              v-else
              src="@/assets/img/reddit.png"
              :alt="website.name"
              class="icon-img"
            />
          </div>
          
          <div class="website-content">
            <h3 class="website-name">{{ website.name }}</h3>
            
            <div class="website-tags">
              <span class="category-tag" :style="{backgroundColor: getCategoryColor(website.categoryId)}">
                {{ getCategoryName(website.categoryId) }}
              </span>
              <span v-for="tag in website.tags" :key="tag" class="tag">
                {{ tag }}
              </span>
            </div>
            
            <p class="website-description">{{ website.description }}</p>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  name: 'Favorites',
  data() {
    return {
      selectedCategory: null,
      categories: [
        { id: null, name: '全部', icon: 'mdi-view-grid' }
      ],
      websites: [],
      loading: true
    };
  },
  computed: {
    filteredWebsites() {
      if (!this.selectedCategory) {
        return this.websites;
      }
      return this.websites.filter(website => website.categoryId === this.selectedCategory);
    }
  },
  methods: {
    // 获取分类
    fetchCategories() {
      this.axios.get("/api/favorites/categories").then(({ data }) => {
        if (data.flag) {
          // 添加"全部"分类
          this.categories = [
            { id: null, name: '全部', icon: 'mdi-view-grid' },
            ...data.data.map(category => ({
              id: category.id,
              name: category.categoryName,
              icon: category.categoryIcon || 'mdi-bookmark'
            }))
          ];
        } else {
          this.$toast({ type: "error", message: "获取分类失败" });
        }
      }).catch(() => {
        this.$toast({ type: "error", message: "获取分类失败" });
      });
    },
    // 获取网站列表
    fetchWebsites() {
      this.loading = true;
      this.axios.get("/api/favorites").then(({ data }) => {
        if (data.flag) {
          this.websites = data.data.map(site => ({
            id: site.id,
            name: site.name,
            url: site.url,
            description: site.description,
            icon: site.icon,
            categoryId: site.categoryId,
            categoryName: site.categoryName,
            tags: site.tags || []
          }));
        } else {
          this.$toast({ type: "error", message: "获取收藏网站失败" });
        }
        this.loading = false;
      }).catch(() => {
        this.$toast({ type: "error", message: "获取收藏网站失败" });
        this.loading = false;
      });
    },
    getCategoryName(categoryId) {
      const category = this.categories.find(c => c.id === categoryId);
      return category ? category.name : '';
    },
    getCategoryColor(categoryId) {
      // 根据分类ID生成颜色，可以根据需要修改
      const colorMap = {
        1: '#4caf50', // 开发工具
        2: '#ff9800', // 设计资源
        3: '#2196f3', // 学习资源
        4: '#9c27b0', // 实用工具
        5: '#f44336'  // 社区论坛
      };
      return colorMap[categoryId] || '#607d8b';
    },
    // 处理图片加载失败
    handleImageError(e) {
      e.target.src = require('@/assets/img/reddit.png');
    }
  },
  created() {
    document.title = '我的收藏 | ' + this.$store.state.blogInfo.websiteName;
    
    // 从API获取数据
    this.fetchCategories();
    this.fetchWebsites();
  }
};
</script>

<style scoped>
.favorites-container {
    position: absolute;
    top: -60px;
    left: 0;
    right: 0;
    min-height: calc(100vh + 60px);
    padding: 120px 20px 60px;
    background-color: #49b1f5;
    background-image: url("@/assets/img/6.jpg");
    background-position: center center;
    background-size: cover;
    background-repeat: no-repeat;
    background-attachment: fixed;
    animation: header-effect 1s;
    overflow-x: hidden;
}

.page-header {
  text-align: center;
  margin-bottom: 30px;
  padding: 15px;
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 10px;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
}

.page-title {
  font-size: 2.2rem;
  color: #49b1f5;
  margin-bottom: 15px;
  font-weight: 700;
}

.page-description {
  color: #555;
  max-width: 700px;
  margin: 0 auto;
}

.category-nav {
  margin-bottom: 30px;
  display: flex;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.8);
  padding: 10px;
  border-radius: 40px;
  max-width: 90%;
  margin-left: auto;
  margin-right: auto;
  overflow-x: auto;
}

.category-active {
  background-color: #49b1f5 !important;
  color: #49b1f5 !important;
  font-weight: bold;
}

.website-grid {
  margin-top: 15px;
  padding: 0 5px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

.website-card {
  border-radius: 8px;
  transition: all 0.3s ease;
  background-color: rgba(255, 255, 255, 0.9);
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  border: 1px solid rgba(0, 0, 0, 0.05);
  cursor: pointer;
  margin-bottom: 10px;
}

.website-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1) !important;
  border-color: transparent;
}

.website-icon {
  display: flex;
  justify-content: center;
  padding: 15px 0 10px;
}

.icon-img {
  width: 50px;
  height: 50px;
  object-fit: contain;
  border-radius: 10px;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
}

.website-content {
  padding: 0 15px 15px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.website-name {
  font-size: 16px;
  font-weight: 600;
  text-align: center;
  margin-bottom: 8px;
  color: #333;
}

.website-tags {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin-bottom: 8px;
  gap: 4px;
}

.category-tag {
  font-size: 11px;
  padding: 3px 8px;
  border-radius: 15px;
  color: white;
  display: inline-block;
  font-weight: 500;
}

.tag {
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 15px;
  background-color: #f0f0f0;
  color: #666;
  display: inline-block;
}

.website-description {
  font-size: 12px;
  line-height: 1.5;
  color: #666;
  text-align: center;
  margin-top: auto;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

/* 深色模式样式 */
.theme--dark .page-header,
[data-theme='dark'] .page-header,
body.theme-dark .page-header {
  background-color: rgba(30, 30, 30, 0.8);
}

.theme--dark .page-title,
[data-theme='dark'] .page-title,
body.theme-dark .page-title {
  color: #49b1f5;
}

.theme--dark .page-description,
[data-theme='dark'] .page-description,
body.theme-dark .page-description {
  color: rgba(255, 255, 255, 0.8);
}

.theme--dark .category-nav,
[data-theme='dark'] .category-nav,
body.theme-dark .category-nav {
  background-color: rgba(30, 30, 30, 0.8);
}

.theme--dark .v-chip,
[data-theme='dark'] .v-chip,
body.theme-dark .v-chip {
  color: rgba(255, 255, 255, 0.8) !important;
}

.theme--dark .website-card,
[data-theme='dark'] .website-card,
body.theme-dark .website-card {
  background-color: rgba(30, 30, 30, 0.9);
  border-color: rgba(255, 255, 255, 0.05);
}

.theme--dark .website-card:hover,
[data-theme='dark'] .website-card:hover,
body.theme-dark .website-card:hover {
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.3) !important;
}

.theme--dark .website-name,
[data-theme='dark'] .website-name,
body.theme-dark .website-name {
  color: rgba(255, 255, 255, 0.9);
}

.theme--dark .website-description,
[data-theme='dark'] .website-description,
body.theme-dark .website-description {
  color: rgba(255, 255, 255, 0.7);
}

.theme--dark .tag,
[data-theme='dark'] .tag,
body.theme-dark .tag {
  background-color: rgba(80, 80, 80, 0.5);
  color: rgba(255, 255, 255, 0.7);
}

.theme--dark .icon-img,
[data-theme='dark'] .icon-img,
body.theme-dark .icon-img {
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.3);
}

@media (max-width: 600px) {
  .favorites-container {
    top: -40px;
    padding-top: 100px;
    padding-bottom: 20px;
    min-height: calc(100vh + 40px);
  }
  
  .page-title {
    font-size: 1.8rem;
  }
  
  .category-nav {
    padding: 8px;
    border-radius: 30px;
  }
  
  .website-card {
    margin-bottom: 15px;
  }
}
</style>
