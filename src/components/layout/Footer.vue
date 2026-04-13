<template>
  <v-footer app padless absolute v-if="!isHidden">
    <div class="footer-wrap">
      <div class="footer-content">
        <!-- 单行信息布局 -->
        <div class="footer-info-row">
          <div class="info-item">
            <v-icon small class="info-icon">mdi-clock-outline</v-icon>
            <span>运行时间: {{ runTime }}</span>
          </div>
          <div class="dot-divider"></div>
          
          <div class="info-item">
            <v-icon small class="info-icon">mdi-eye-outline</v-icon>
            <span>总访问量: {{ viewsCount }}</span>
          </div>
          <div class="dot-divider"></div>
          
          <div class="info-item">
            <v-icon small class="info-icon">mdi-file-document-outline</v-icon>
            <span class="latest-article-label">最新发布: 
              <router-link :to="'/articles/' + latestArticleId" class="recent-link">
                {{ latestArticleTitle }}
              </router-link>
            </span>
          </div>
        </div>
        
        <!-- 装饰分割线 -->
        <div class="footer-divider"></div>
        
        <!-- 版权信息行 -->
        <div class="footer-copyright-row">
          <div class="copyright">©2025 - {{ new Date().getFullYear() }} By Allure</div>
          <div class="dot-divider hide-mobile"></div>
          <div class="beian-container">
            <a href="https://beian.miit.gov.cn/" target="_blank" class="beian"> 备案号 </a>
          </div>
          <div class="dot-divider hide-mobile"></div>
          <div class="powered-by">Powered by Vue.js & Vuetify</div>
        </div>
      </div>
    </div>
  </v-footer>
</template>

<script>
export default {
  data() {
    return {
      runTime: "0天0时0分0秒",
      viewsCount: 0,
      latestArticleTitle: "加载中...",
      latestArticleId: null,
      timer: null
    };
  },
  computed: {
    isHidden() {
      // 在留言页和AI助手页都隐藏底部
      return this.$route.path === "/message" || this.$route.path === "/ai-assistant";
    }
  },
  created() {
    this.getBlogInfo();
    this.getLatestArticle();
    this.calculateRunTime();
    // 设置定时器，每秒更新一次运行时间
    this.timer = setInterval(this.calculateRunTime, 1000);
  },
  beforeDestroy() {
    // 组件销毁前清除定时器
    if (this.timer) {
      clearInterval(this.timer);
    }
  },
  methods: {
    // 获取博客信息
    getBlogInfo() {
      this.axios.get("/api/").then(({ data }) => {
        if (data.data && data.data.viewsCount) {
          this.viewsCount = data.data.viewsCount;
        }
      }).catch(error => {
        
      });
    },
    // 获取最新文章
    getLatestArticle() {
      this.axios.get("/api/articles/newest").then(({ data }) => {
        if (data.data && data.data.length > 0) {
          const latestArticle = data.data[0];
          this.latestArticleTitle = latestArticle.articleTitle;
          this.latestArticleId = latestArticle.id;
        }
      }).catch(error => {
        
        this.latestArticleTitle = "暂无更新";
      });
    },
    // 计算博客运行时间
    calculateRunTime() {
      var timeold = new Date().getTime() - new Date("March 26,2025").getTime();
      var msPerDay = 24 * 60 * 60 * 1000;
      var daysold = Math.floor(timeold / msPerDay);
      var str = "";
      var day = new Date();
      str += daysold + "天";
      str += day.getHours() + "时";
      str += day.getMinutes() + "分";
      str += day.getSeconds() + "秒";
      this.runTime = str;
    }
  }
};
</script>

<style scoped>
.footer-wrap {
  width: 100%;
  position: relative;
  color: #fff;
  font-size: 13px;
  text-align: center;
  background: linear-gradient(to right, #6a11cb 0%, #2575fc 100%);
  box-shadow: 0 -1px 5px rgba(0, 0, 0, 0.1);
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 12px 20px;
}

.footer-info-row {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 8px;
}

.footer-copyright-row {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
  font-size: 12px;
  opacity: 0.9;
}

.info-item {
  display: flex;
  align-items: center;
  white-space: nowrap;
  color: #ffffff;
}

.info-icon {
  margin-right: 6px;
  font-size: 14px;
  color: #ffffff;
}

.dot-divider {
  width: 3px;
  height: 3px;
  background-color: rgba(255, 255, 255, 0.7);
  border-radius: 50%;
  display: inline-block;
}

.footer-divider {
  height: 1px;
  background: linear-gradient(90deg, 
    rgba(255,255,255,0) 0%, 
    rgba(255,255,255,0.5) 50%, 
    rgba(255,255,255,0) 100%);
  margin: 0 auto;
  width: 80%;
}

.latest-article-label {
  color: #ffffff;
}

.recent-link {
  color: #ffffff;
  text-decoration: none;
  border-bottom: 1px dashed rgba(255,255,255,0.4);
  padding-bottom: 1px;
  transition: all 0.2s;
  max-width: 150px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: inline-block;
  vertical-align: bottom;
}

.recent-link:hover {
  border-bottom: 1px solid #ffffff;
  opacity: 0.9;
  color: #ffffff;
}

.copyright, .beian, .powered-by {
  color: #ffffff;
}

.beian, .powered-by a {
  color: #ffffff !important;
  text-decoration: none;
  transition: opacity 0.2s;
}

.beian:hover, .powered-by a:hover {
  opacity: 0.8;
}

/* 光效设计 */
.footer-wrap::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, 
    rgba(255,255,255,0) 0%, 
    rgba(255,255,255,0.6) 50%, 
    rgba(255,255,255,0) 100%);
}

/* 响应式调整 */
@media (max-width: 768px) {
  .hide-mobile {
    display: none;
  }
  
  .footer-info-row, .footer-copyright-row {
    flex-direction: column;
    gap: 6px;
  }
  
  .dot-divider {
    display: none;
  }
  
  .footer-content {
    padding: 10px 16px;
  }
  
  .footer-divider {
    margin: 6px auto;
  }
}

/* 悬停效果 */
.info-item:hover .info-icon {
  transform: scale(1.1);
  transition: transform 0.2s ease;
}

.recent-link, .beian {
  position: relative;
  overflow: hidden;
  color: #ffffff;
}

.recent-link::after, .beian::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 1px;
  background-color: #fff;
  transition: width 0.3s ease;
}

.recent-link:hover::after, .beian:hover::after {
  width: 100%;
}
</style>
