<template>
  <div>
    <!-- 标签或分类名 -->
    <div :class="categoryOrTag + ' banner'">
      <h1 class="banner-title animated fadeInDown">{{ title }} - {{ name }}</h1>
    </div>
    <div class="article-list-wrapper">
      <v-row>
        <v-col md="4" cols="12" v-for="item of articleList" :key="item.id">
          <!-- 文章 -->
          <v-card class="animated zoomIn article-item-card">
            <div class="article-item-cover">
              <router-link :to="'/articles/' + item.id">
                <!-- 缩略图 -->
                <v-img
                  class="on-hover"
                  width="100%"
                  height="100%"
                  :src="item.articleCover"
                />
              </router-link>
            </div>
            <div class="article-item-info">
              <!-- 文章标题 -->
              <div>
                <router-link :to="'/articles/' + item.id">
                  {{ item.articleTitle }}
                </router-link>
              </div>
              <div style="margin-top:0.375rem">
                <!-- 发表时间 -->
                <v-icon size="20">mdi-clock-outline</v-icon>
                {{ item.createTime | date }}
                <!-- 文章分类 -->
                <router-link
                  :to="'/categories/' + item.categoryId"
                  class="float-right"
                >
                  <v-icon>mdi-bookmark</v-icon>{{ item.categoryName }}
                </router-link>
              </div>
            </div>
            <!-- 分割线 -->
            <v-divider></v-divider>
            <!-- 文章标签 -->
            <div class="tag-wrapper">
              <router-link
                :to="'/tags/' + tag.id"
                class="tag-btn"
                v-for="tag of item.tagDTOList"
                :key="tag.id"
              >
                {{ tag.tagName }}
              </router-link>
            </div>
          </v-card>
        </v-col>
      </v-row>
      <!-- 无限加载 -->
      <infinite-loading @infinite="infiniteHandler">
        <div slot="no-more" />
      </infinite-loading>
    </div>
  </div>
</template>

<script>
import InfiniteLoading from "vue-infinite-loading";

export default {
  components: {
    InfiniteLoading
  },
  created() {
    const path = this.$route.path;
    // console.log("当前路由路径:", path);
    // console.log("路由参数:", this.$route.params);
    
    if (path.indexOf("/categories") != -1) {
      this.title = "分类";
      this.categoryOrTag = "category-banner";
    } else {
      this.title = "标签";
      this.categoryOrTag = "tag-banner";
    }
    
    // 不在created中加载数据，让infinite-loading组件来触发
    // 移除this.loadInitialData()调用
  },
  data: function() {
    return {
      current: 1,
      articleList: [],
      name: "",
      title: "",
      categoryOrTag: ""
    };
  },
  methods: {
    infiniteHandler($state) {
      const path = this.$route.path;
      let categoryId = this.$route.params.categoryId;
      
      // 尝试从路径中提取ID
      if (!categoryId && path.indexOf("/categories/") !== -1) {
        const match = path.match(/\/categories\/(\d+)/);
        if (match && match[1]) {
          categoryId = match[1];
        }
      }
      
      // 如果categoryId未定义，则不发送请求
      if (path.indexOf("/categories/") !== -1 && !categoryId) {
        // console.error("分类ID未定义，无法加载数据");
        $state.complete();
        return;
      }
      
      let tagId = this.$route.params.tagId;
      if (!tagId && path.indexOf("/tags/") !== -1) {
        const match = path.match(/\/tags\/(\d+)/);
        if (match && match[1]) {
          tagId = match[1];
        }
      }
      
      if (path.indexOf("/tags/") !== -1 && !tagId) {
        // console.error("标签ID未定义，无法加载数据");
        $state.complete();
        return;
      }
      
      let apiUrl = "";
      if (path.indexOf("/categories/") !== -1) {
        // console.log("正在加载分类文章，分类ID:", categoryId);
        apiUrl = `/api/categories/${categoryId}`;
      } else if (path.indexOf("/tags/") !== -1) {
        // console.log("正在加载标签文章，标签ID:", tagId);
        apiUrl = `/api/tags/${tagId}`;
      } else {
        apiUrl = "/api" + path;
      }
      
      // console.log("发送请求到:", apiUrl, "参数:", { current: this.current });
      
      this.axios
        .get(apiUrl, {
          params: {
            current: Number(this.current) // 确保传递数字而不是字符串
          }
        })
        .then(({ data }) => {
          // console.log("接收到数据:", data);
          if (data.data && data.data.articlePreviewDTOList && data.data.articlePreviewDTOList.length) {
            // 更新名称（仅第一次）
            if (this.name === "") {
              this.name = data.data.name;
              document.title = this.title + " - " + this.name;
            }
            
            this.articleList.push(...data.data.articlePreviewDTOList);
            this.current++;
            $state.loaded();
          } else {
            $state.complete();
          }
        })
        .catch(error => {
          // console.error("加载更多数据失败:", error);
          $state.error();
        });
    }
  },
  // 添加路由观察器，当路由参数变化时重置数据
  watch: {
    '$route.path'() {
      // 重置数据
      this.current = 1;
      this.articleList = [];
      this.name = "";
    }
  }
};
</script>

<style scoped>
.tag-banner {
  background: url("@/assets/img/6.jpg")
    center center / cover no-repeat;
  background-color: #49b1f5;
}
.category-banner {
  background: url("@/assets/img/6.jpg")
    center center / cover no-repeat;
  background-color: #49b1f5;
}
@media (min-width: 760px) {
  .article-list-wrapper {
    max-width: 1106px;
    margin: 370px auto 1rem auto;
  }
  .article-item-card:hover {
    transition: all 0.3s;
    box-shadow: 0 4px 12px 12px rgba(7, 17, 27, 0.15);
  }
  .article-item-card:not(:hover) {
    transition: all 0.3s;
  }
  .article-item-card:hover .on-hover {
    transition: all 0.6s;
    transform: scale(1.1);
  }
  .article-item-card:not(:hover) .on-hover {
    transition: all 0.6s;
  }
  .article-item-info {
    line-height: 1.7;
    padding: 15px 15px 12px 18px;
    font-size: 15px;
  }
}
@media (max-width: 759px) {
  .article-list-wrapper {
    margin-top: 230px;
    padding: 0 12px;
  }
  .article-item-info {
    line-height: 1.7;
    padding: 15px 15px 12px 18px;
  }
}
.article-item-card {
  border-radius: 8px !important;
  box-shadow: 0 4px 8px 6px rgba(7, 17, 27, 0.06);
}
.article-item-card a {
  transition: all 0.3s;
}
.article-item-cover {
  height: 220px;
  overflow: hidden;
}
.article-item-card a:hover {
  color: #8e8cd8;
}
.tag-wrapper {
  padding: 10px 15px 10px 18px;
}
.tag-wrapper a {
  color: #fff !important;
}
.tag-btn {
  display: inline-block;
  font-size: 0.725rem;
  line-height: 22px;
  height: 22px;
  border-radius: 10px;
  padding: 0 12px !important;
  background: linear-gradient(to right, #bf4643 0%, #6c9d8f 100%);
  opacity: 0.6;
  margin-right: 0.5rem;
}
</style>
