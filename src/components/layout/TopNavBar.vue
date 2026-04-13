<template>
  <v-app-bar app :class="navClass" hide-on-scroll flat height="60">
    <!-- 手机端导航栏 -->
    <div class="d-md-none nav-mobile-container">
      <div style="font-size:18px;font-weight:bold">
        <router-link to="/">
          Allure
        </router-link>
      </div>
      <div style="margin-left:auto">
        <a @click="toggleDarkMode" class="theme-switch-btn-mobile">
          <transition name="theme-slide" mode="out-in">
            <div :key="isDarkMode" style="display:flex;align-items:center;">
              <i :class="['iconfont', isDarkMode ? 'icontaiyang' : 'iconyueliang']"></i>
              <span>{{isDarkMode ? '浅色' : '深色'}}</span>
            </div>
          </transition>
        </a>
        <a @click="openSearch" style="margin-left:10px"><i class="iconfont iconsousuo"/></a>
        <a @click="openDrawer" style="margin-left:10px;font-size:20px">
          <i class="iconfont iconhanbao" />
        </a>
      </div>
    </div>
    <!-- 电脑导航栏 -->
    <div class="d-md-block d-none nav-container">
      <div class="float-left blog-title">
        <router-link to="/">
          Allure
        </router-link>
      </div>
      <div class="float-right nav-title">
        <div class="menus-btn theme-switch-btn">
          <a @click="toggleDarkMode" class="capsule-btn">
            <transition name="theme-slide" mode="out-in">
              <div :key="isDarkMode" class="theme-content">
                <i :class="['iconfont', isDarkMode ? 'icontaiyang' : 'iconyueliang']"></i>
                <span>{{isDarkMode ? '浅色' : '深色'}}</span>
              </div>
            </transition>
          </a>
        </div>
        <div class="menus-btn">
          <a @click="openSearch"><i class="iconfont iconsousuo" /> 搜索</a>
        </div>
        <div class="menus-item">
          <router-link to="/">
            <i class="iconfont iconzhuye" /> 首页
          </router-link>
        </div>
        <div class="menus-item">
          <router-link to="/archives">
            <i class="iconfont iconguidang" /> 归档
          </router-link>
        </div>
        <div class="menus-item">
          <router-link to="/categories">
            <i class="iconfont iconfenlei" /> 分类
          </router-link>
        </div>
        <div class="menus-item">
          <router-link to="/tags">
            <i class="iconfont iconbiaoqian" /> 标签
          </router-link>
        </div>
        <div class="menus-item">
          <router-link to="/about">
            <i class="iconfont iconzhifeiji" /> 关于
          </router-link>
        </div>
        <div class="menus-item">
          <router-link to="/message">
            <i class="iconfont iconpinglunzu" /> 留言
          </router-link>
        </div>
        <div class="menus-item">
          <router-link to="/ai-assistant">
            <i class="fas fa-robot ai-icon"></i>
            <span>智能助手</span>
          </router-link>
        </div>
        <div class="menus-item favorite-item">
          <router-link to="/favorites">
            <i class="fas fa-bookmark favorite-icon"></i> 收藏
          </router-link>
        </div>
        <div class="user-btn">
          <a v-if="!this.$store.state.avatar" @click="openLogin">
            <i class="iconfont icondenglu" /> 登录
          </a>
          <template v-else>
            <img
              class="user-avatar"
              :src="this.$store.state.avatar"
              height="30"
              width="30"
            />
            <ul class="user-submenu">
              <li>
                <router-link to="/user">
                  <i class="iconfont icongerenzhongxin" /> 个人中心
                </router-link>
              </li>
              <li>
                <a @click="logout"><i class="iconfont icontuichu" /> 退出</a>
              </li>
            </ul>
          </template>
        </div>
      </div>
    </div>
  </v-app-bar>
</template>

<script>
export default {
  mounted() {
    window.addEventListener("scroll", this.scroll);
    
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      this.applyTheme(savedTheme === 'dark');
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.applyTheme(prefersDark);
    }
  },
  data: function() {
    return {
      navClass: "",
      isDarkMode: false
    };
  },
  methods: {
    scroll() {
      const that = this;
      let scrollTop =
        window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop;
      that.scrollTop = scrollTop;
      if (that.scrollTop > 60) {
        that.navClass = "nav-fixed";
      } else {
        that.navClass = "nav";
      }
    },
    openSearch() {
      this.$store.state.searchFlag = true;
    },
    openDrawer() {
      this.$store.state.drawer = true;
    },
    openLogin() {
      this.$store.state.loginFlag = true;
    },
    logout() {
      if (this.$route.path == "/user") {
        this.$router.go(-1);
      }
      this.axios.get("/api/logout").then(({ data }) => {
        if (data.flag) {
          this.$store.commit("logout");
          this.$toast({ type: "success", message: data.message });
        } else {
          this.$toast({ type: "error", message: data.message });
        }
      });
    },
    toggleDarkMode() {
      this.isDarkMode = !this.isDarkMode;
      this.applyTheme(this.isDarkMode);
      
      localStorage.setItem('theme', this.isDarkMode ? 'dark' : 'light');
    },
    applyTheme(isDark) {
      this.isDarkMode = isDark;
      
      this.$vuetify.theme.dark = isDark;
      
      if (isDark) {
        document.body.classList.add('theme-dark');
        document.documentElement.setAttribute('data-theme', 'dark');
      } else {
        document.body.classList.remove('theme-dark');
        document.documentElement.setAttribute('data-theme', 'light');
        
        this.cleanupInlineStyles();
      }
      
      this.$root.$emit('theme-changed', isDark);
    },
    cleanupInlineStyles() {
      const elementsWithInlineStyles = document.querySelectorAll('[style*="color"]');
      elementsWithInlineStyles.forEach(el => {
        if (el.style.color && 
            (el.style.color.includes('#fff') || 
             el.style.color.includes('white') || 
             el.style.color.includes('rgb(255, 255, 255)'))) {
          el.style.color = '';
        }
      });
    
      void document.body.offsetHeight; 
      document.body.style.display = '';
    }
  },
  computed: {
    avatar() {
      return this.$store.state.avatar;
    }
  }
};
</script>

<style scoped>
i {
  margin-right: 4px;
}
ul {
  list-style: none;
}
.nav {
  background: rgba(0, 0, 0, 0) !important;
}
.nav a {
  color: #eee !important;
}
.nav .menus-item a {
  text-shadow: 0.05rem 0.05rem 0.1rem rgba(0, 0, 0, 0.3);
}
.nav .blog-title a {
  text-shadow: 0.1rem 0.1rem 0.2rem rgba(0, 0, 0, 0.15);
}
.theme--light.nav-fixed {
  background: rgba(255, 255, 255, 0.8) !important;
  box-shadow: 0 5px 6px -5px rgba(133, 133, 133, 0.6);
}
.theme--dark.nav-fixed {
  background: rgba(18, 18, 18, 0.8) !important;
}
.theme--dark.nav-fixed a {
  color: rgba(255, 255, 255, 0.8) !important;
}
.theme--light.nav-fixed a {
  color: #4c4948 !important;
}
.nav-fixed .menus-item a,
.nav-fixed .menus-btn a,
.nav-fixed .blog-title a {
  text-shadow: none;
}
.nav-container {
  font-size: 14px;
  width: 100%;
  height: 100%;
}
.nav-mobile-container {
  width: 100%;
  display: flex;
  align-items: center;
}
.blog-title,
.nav-title {
  display: flex;
  align-items: center;
  height: 100%;
}
.blog-title a {
  font-size: 18px;
  font-weight: bold;
}
.user-btn,
.menus-btn,
.menus-item {
  position: relative;
  display: inline-block;
  margin: 0 0 0 0.875rem;
}
.menus-btn a,
.menus-item a {
  transition: all 0.2s;
}
.nav-fixed .menus-btn a:hover,
.nav-fixed .menus-item a:hover {
  color: #49b1f5 !important;
}
.menus-item a:hover:after {
  width: 100%;
}
.menus-item a:after {
  position: absolute;
  bottom: -5px;
  left: 0;
  z-index: -1;
  width: 0;
  height: 3px;
  background-color: #80c8f8;
  content: "";
  transition: all 0.3s ease-in-out;
}
.user-btn a {
  transition: all 0.2s;
}
.user-avatar {
  cursor: pointer;
  border-radius: 50%;
}
.user-btn:hover .user-submenu {
  display: block;
}
.user-submenu {
  position: absolute;
  display: none;
  right: 0;
  width: max-content;
  margin-top: 8px;
  box-shadow: 0 5px 20px -4px rgba(0, 0, 0, 0.5);
  background-color: #fff;
  animation: submenu 0.3s 0.1s ease both;
}
.user-submenu:before {
  position: absolute;
  top: -8px;
  left: 0;
  width: 100%;
  height: 20px;
  content: "";
}
.user-submenu a {
  line-height: 2;
  color: #4c4948 !important;
  text-shadow: none;
  display: block;
  padding: 6px 14px;
}
.user-submenu a:hover {
  background: #4ab1f4;
}
@keyframes submenu {
  0% {
    opacity: 0;
    filter: alpha(opacity=0);
    transform: translateY(10px);
  }
  100% {
    opacity: 1;
    filter: none;
    transform: translateY(0);
  }
}
.robot-icon {
  width: 16px;
  height: 16px;
  vertical-align: middle;
  margin-right: 4px;
  position: relative;
  top: -1px;
}

.theme-switch-btn .capsule-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  width: 72px;
  height: 32px;
  border-radius: 16px;
  background: linear-gradient(145deg, #4facf1, #2196f3);
  box-shadow: 0 2px 10px rgba(33, 150, 243, 0.3);
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  overflow: hidden;
  padding: 0 4px;
}

.theme-switch-btn .capsule-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(33, 150, 243, 0.4);
  width: 76px;
}

.theme-switch-btn .capsule-btn:active {
  transform: translateY(0);
  box-shadow: 0 2px 8px rgba(33, 150, 243, 0.3);
  transition: all 0.2s;
}

.theme-switch-btn .theme-content {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  color: white !important;
}

.theme-switch-btn .theme-content i {
  font-size: 16px;
  margin-right: 4px;
  color: white !important;
}

.theme-switch-btn .theme-content span {
  font-size: 13px;
  font-weight: 500;
  color: white !important;
  letter-spacing: 0.5px;
}

.theme-switch-btn-mobile {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 28px;
  border-radius: 14px;
  background: linear-gradient(145deg, #4facf1, #2196f3);
  box-shadow: 0 2px 6px rgba(33, 150, 243, 0.3);
  margin-right: 5px;
}

.theme-switch-btn-mobile i {
  font-size: 14px;
  color: white;
  margin-right: 3px;
}

.theme-switch-btn-mobile span {
  font-size: 12px;
  color: white;
}

.theme-slide-enter-active, .theme-slide-leave-active {
  transition: all 0.4s cubic-bezier(0.33, 1, 0.68, 1);
}

.theme-slide-enter {
  opacity: 0;
  transform: translateX(-10px);
}

.theme-slide-leave-to {
  opacity: 0;
  transform: translateX(10px);
}

.theme--dark .theme-switch-btn .capsule-btn {
  background: linear-gradient(145deg, #6c5ce7, #483d8b);
  box-shadow: 0 2px 10px rgba(108, 92, 231, 0.3);
}

.theme--dark .theme-switch-btn .capsule-btn:hover {
  box-shadow: 0 5px 15px rgba(108, 92, 231, 0.4);
}

.theme--dark .theme-switch-btn-mobile {
  background: linear-gradient(145deg, #6c5ce7, #483d8b);
  box-shadow: 0 2px 6px rgba(108, 92, 231, 0.3);
}

.theme-icon-fade-enter-active, .theme-icon-fade-leave-active {
  transition: opacity 0.25s, transform 0.25s;
}
.theme-icon-fade-enter, .theme-icon-fade-leave-to {
  opacity: 0;
  transform: scale(0.8);
}

</style>
