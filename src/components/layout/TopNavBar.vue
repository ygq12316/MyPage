<template>
  <v-app-bar app :class="navClass" hide-on-scroll flat height="60">
    <div class="d-md-none nav-mobile-container">
      <div style="font-size:18px;font-weight:bold">
        <router-link to="/">Allure</router-link>
      </div>
      <div style="margin-left:auto">
        <a @click="toggleDarkMode" class="theme-switch-btn-mobile">
          <transition name="theme-slide" mode="out-in">
            <div :key="isDarkMode" style="display:flex;align-items:center;">
              <i :class="['iconfont', isDarkMode ? 'icontaiyang' : 'iconyueliang']"></i>
              <span>{{ isDarkMode ? 'Light' : 'Dark' }}</span>
            </div>
          </transition>
        </a>
        <a @click="openSearch" style="margin-left:10px"><i class="iconfont iconsousuo"/></a>
        <a @click="openDrawer" style="margin-left:10px;font-size:20px">
          <i class="iconfont iconhanbao" />
        </a>
      </div>
    </div>

    <div class="d-md-block d-none nav-container">
      <div class="float-left blog-title">
        <router-link to="/">Allure</router-link>
      </div>
      <div class="float-right nav-title">
        <div class="menus-btn theme-switch-btn">
          <a @click="toggleDarkMode" class="capsule-btn">
            <transition name="theme-slide" mode="out-in">
              <div :key="isDarkMode" class="theme-content">
                <i :class="['iconfont', isDarkMode ? 'icontaiyang' : 'iconyueliang']"></i>
                <span>{{ isDarkMode ? 'Light' : 'Dark' }}</span>
              </div>
            </transition>
          </a>
        </div>

        <div class="menus-btn">
          <a @click="openSearch"><i class="iconfont iconsousuo" /> Search</a>
        </div>

        <div class="menus-item"><router-link to="/"><i class="iconfont iconzhuye" /> Home</router-link></div>
        <div class="menus-item"><router-link to="/archives"><i class="iconfont iconguidang" /> Archives</router-link></div>
        <div class="menus-item"><router-link to="/categories"><i class="iconfont iconfenlei" /> Categories</router-link></div>
        <div class="menus-item"><router-link to="/tags"><i class="iconfont iconbiaoqian" /> Tags</router-link></div>
        <div class="menus-item"><router-link to="/about"><i class="iconfont iconzhifeiji" /> About</router-link></div>
        <div class="menus-item"><router-link to="/message"><i class="iconfont iconpinglunzu" /> Message</router-link></div>
        <div class="menus-item"><router-link to="/ai-assistant"><i class="fas fa-robot ai-icon"></i> AI</router-link></div>
        <div class="menus-item favorite-item"><router-link to="/favorites"><i class="fas fa-bookmark favorite-icon"></i> Favorites</router-link></div>
      </div>
    </div>
  </v-app-bar>
</template>

<script>
export default {
  data() {
    return {
      navClass: "",
      isDarkMode: false
    };
  },
  mounted() {
    window.addEventListener("scroll", this.scroll);

    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      this.applyTheme(savedTheme === "dark");
    } else {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      this.applyTheme(prefersDark);
    }
  },
  methods: {
    scroll() {
      const scrollTop =
        window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop;
      this.navClass = scrollTop > 60 ? "nav-fixed" : "nav";
    },
    openSearch() {
      this.$store.state.searchFlag = true;
    },
    openDrawer() {
      this.$store.state.drawer = true;
    },
    toggleDarkMode() {
      this.isDarkMode = !this.isDarkMode;
      this.applyTheme(this.isDarkMode);
      localStorage.setItem("theme", this.isDarkMode ? "dark" : "light");
    },
    applyTheme(isDark) {
      this.isDarkMode = isDark;
      this.$vuetify.theme.dark = isDark;

      if (isDark) {
        document.body.classList.add("theme-dark");
        document.documentElement.setAttribute("data-theme", "dark");
      } else {
        document.body.classList.remove("theme-dark");
        document.documentElement.setAttribute("data-theme", "light");
      }

      this.$root.$emit("theme-changed", isDark);
    }
  }
};
</script>

<style scoped>
i { margin-right: 4px; }
ul { list-style: none; }
.nav { background: rgba(0, 0, 0, 0) !important; }
.nav a { color: #eee !important; }
.nav .menus-item a { text-shadow: 0.05rem 0.05rem 0.1rem rgba(0, 0, 0, 0.3); }
.nav .blog-title a { text-shadow: 0.1rem 0.1rem 0.2rem rgba(0, 0, 0, 0.15); }
.theme--light.nav-fixed { background: rgba(255, 255, 255, 0.8) !important; box-shadow: 0 5px 6px -5px rgba(133, 133, 133, 0.6); }
.theme--dark.nav-fixed { background: rgba(18, 18, 18, 0.8) !important; }
.theme--dark.nav-fixed a { color: rgba(255, 255, 255, 0.8) !important; }
.theme--light.nav-fixed a { color: #4c4948 !important; }
.nav-fixed .menus-item a, .nav-fixed .menus-btn a, .nav-fixed .blog-title a { text-shadow: none; }
.nav-container { font-size: 14px; width: 100%; height: 100%; }
.nav-mobile-container { width: 100%; display: flex; align-items: center; }
.blog-title, .nav-title { display: flex; align-items: center; height: 100%; }
.blog-title a { font-size: 18px; font-weight: bold; }
.menus-btn, .menus-item { position: relative; display: inline-block; margin: 0 0 0 0.875rem; }
.menus-btn a, .menus-item a { transition: all 0.2s; }
.nav-fixed .menus-btn a:hover, .nav-fixed .menus-item a:hover { color: #49b1f5 !important; }
.menus-item a:hover:after { width: 100%; }
.menus-item a:after { position: absolute; bottom: -5px; left: 0; z-index: -1; width: 0; height: 3px; background-color: #80c8f8; content: ""; transition: all 0.3s ease-in-out; }
.theme-switch-btn .capsule-btn { display: flex; align-items: center; justify-content: center; position: relative; width: 72px; height: 32px; border-radius: 16px; background: linear-gradient(145deg, #4facf1, #2196f3); box-shadow: 0 2px 10px rgba(33, 150, 243, 0.3); transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); overflow: hidden; padding: 0 4px; }
.theme-switch-btn .capsule-btn:hover { transform: translateY(-2px); box-shadow: 0 5px 15px rgba(33, 150, 243, 0.4); width: 76px; }
.theme-switch-btn .theme-content { display: flex; align-items: center; justify-content: center; width: 100%; color: white !important; }
.theme-switch-btn .theme-content i { font-size: 16px; margin-right: 4px; color: white !important; }
.theme-switch-btn .theme-content span { font-size: 13px; font-weight: 500; color: white !important; letter-spacing: 0.5px; }
.theme-switch-btn-mobile { display: inline-flex; align-items: center; justify-content: center; width: 64px; height: 28px; border-radius: 14px; background: linear-gradient(145deg, #4facf1, #2196f3); box-shadow: 0 2px 6px rgba(33, 150, 243, 0.3); margin-right: 5px; }
.theme-switch-btn-mobile i { font-size: 14px; color: white; margin-right: 3px; }
.theme-switch-btn-mobile span { font-size: 12px; color: white; }
.theme-slide-enter-active, .theme-slide-leave-active { transition: all 0.4s cubic-bezier(0.33, 1, 0.68, 1); }
.theme-slide-enter { opacity: 0; transform: translateX(-10px); }
.theme-slide-leave-to { opacity: 0; transform: translateX(10px); }
.theme--dark .theme-switch-btn .capsule-btn { background: linear-gradient(145deg, #6c5ce7, #483d8b); box-shadow: 0 2px 10px rgba(108, 92, 231, 0.3); }
.theme--dark .theme-switch-btn-mobile { background: linear-gradient(145deg, #6c5ce7, #483d8b); box-shadow: 0 2px 6px rgba(108, 92, 231, 0.3); }
</style>
