import Vue from "vue";
import VueRouter from "vue-router";
import store from "../store";

Vue.use(VueRouter);

const routes = [
  { path: "/", component: () => import("../views/home/Home.vue"), meta: { title: "AllureBlog" } },
  { path: "/articles/:articleId", component: () => import("../views/article/Article.vue") },
  { path: "/archives", component: () => import("../views/archive/Archive.vue"), meta: { title: "Archives" } },
  { path: "/tags", component: () => import("../views/tag/Tag.vue"), meta: { title: "Tags" } },
  { path: "/categories", component: () => import("../views/category/Category.vue"), meta: { title: "Categories" } },
  { path: "/categories/*", component: () => import("../components/ArticleList.vue") },
  { path: "/about", component: () => import("../views/about/About.vue"), meta: { title: "About" } },
  { path: "/message", component: () => import("../views/message/Messsage.vue"), meta: { title: "Message" } },
  { path: "/tags/*", component: () => import("../components/ArticleList.vue") },
  { path: "/ai-assistant", name: "AIAssistant", component: () => import("../views/ai/AIAgent.vue"), meta: { title: "AI Assistant - Allure" } },
  { path: "/favorites", component: () => import("../views/favorites/Favorites.vue"), meta: { title: "Favorites" } }
];

const router = new VueRouter({
  mode: "hash",
  base: "/",
  routes
});

router.beforeEach((to, from, next) => {
  store.dispatch("showLoading", "Loading...");
  next();
});

router.afterEach(() => {
  setTimeout(() => {
    store.dispatch("hideLoading");
  }, 300);
});

export default router;
