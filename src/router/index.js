import Vue from "vue";
import VueRouter from "vue-router";
import store from "../store";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    component: () => import("../views/home/Home.vue"),
    meta: {
      title: "AllureBlog"
    }
  },
  {
    path: "/articles/:articleId",
    component: () => import("../views/article/Article.vue")
  },
  {
    path: "/archives",
    component: () => import("../views/archive/Archive.vue"),
    meta: { title: "归档" }
  },
  {
    path: "/tags",
    component: () => import("../views/tag/Tag.vue"),
    meta: { title: "标签" }
  },
  {
    path: "/categories",
    component: () => import("../views/category/Category.vue"),
    meta: { title: "分类" }
  },
  {
    path: "/categories/*",
    component: () => import("../components/ArticleList.vue")
  },
  {
    path: "/about",
    component: () => import("../views/about/About.vue"),
    meta: { title: "关于我" }
  },
  {
    path: "/message",
    component: () => import("../views/message/Messsage.vue"),
    meta: { title: "留言板" }
  },
  {
    path: "/tags/*",
    component: () => import("../components/ArticleList.vue")
  },
  {
    path: "/user",
    component: () => import("../views/user/User.vue"),
    meta: { title: "个人中心" }
  },
  {
    path: "/oauth/login/qq",
    component: () => import("../components/OauthLogin.vue")
  },
  {
    path: "/oauth/login/weibo",
    component: () => import("../components/OauthLogin.vue")
  },
  {
    path: "/oauth/login/github",
    component: () => import("../components/OauthLogin")
  },
  {
    path: "/ai-assistant",
    name: "AIAssistant",
    component: () => import("../views/ai/AIAgent.vue"),
    meta: { title: "AI智能助手 - Allure" }
  },
  {
    path: "/favorites",
    component: () => import("../views/favorites/Favorites.vue"),
    meta: { title: "我的收藏" }
  }
];

// GitHub Pages 不支持 history 模式的服务端路由，改用 hash 模式
const router = new VueRouter({
  mode: "hash",
  base: "/",
  routes
});

router.beforeEach((to, from, next) => {
  store.dispatch("showLoading", "页面加载中...");
  next();
});

router.afterEach(() => {
  setTimeout(() => {
    store.dispatch("hideLoading");
  }, 300);
});

export default router;
