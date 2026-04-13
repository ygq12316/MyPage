<template>
  <div class="home-banner">
    <div class="banner-container">
      <h1 class="blog-title animated zoomIn">
        AllureBlog
      </h1>
      <div class="blog-intro">
        {{ obj.output }} <span class="typed-cursor">|</span>
      </div>
      <div class="blog-contact">
        <a
          class="iconfont iconqq"
          target="_blank"
          href="http://wpa.qq.com/msgrd?v=3&uin=2483433033&site=qq&menu=yes"
        />
        <a
          target="_blank"
          href="https://gitee.com/feng_meiyu"
          class="iconfont icongitee-fill-round"
        />
      </div>
    </div>
  </div>
</template>

<script>
import EasyTyper from "easy-typer-js";

export default {
  created() {
    this.init();
  },
  data: function() {
    return {
      obj: {
        output: "",
        isEnd: false,
        speed: 300,
        singleBack: false,
        sleep: 0,
        type: "rollback",
        backSpeed: 40,
        sentencePause: true
      }
    };
  },
  methods: {
    init() {
      document.title = this.$route.meta.title;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      fetch("https://v1.hitokoto.cn?c=i", {
        signal: controller.signal
      })
        .then(res => {
          clearTimeout(timeoutId);
          if (!res.ok) {
            throw new Error("网络响应异常");
          }
          return res.json();
        })
        .then(({ hitokoto }) => {
          this.initTyped(hitokoto);
        })
        .catch(() => {
          const defaultQuotes = [
            "欢迎来到我的个人博客，望你在这里能找到值得收藏的知识。",
            "生活不止眼前的苟且，还有诗和远方的田野。",
            "代码是写给人看的，顺便让机器执行一下。",
            "学习不是为了成为别人，而是为了成为更好的自己。"
          ];
          const randomQuote = defaultQuotes[Math.floor(Math.random() * defaultQuotes.length)];
          this.initTyped(randomQuote);
        });
    },
    initTyped(input, fn, hooks) {
      const obj = this.obj;
      // eslint-disable-next-line no-unused-vars
      const typed = new EasyTyper(obj, input, fn, hooks);
    }
  }
};
</script>

<style lang="stylus">
.typed-cursor
  opacity: 1
  animation: blink 0.7s infinite
@keyframes blink
  0%
    opacity: 1
  50%
    opacity: 0
  100%
    opacity: 1
</style>

<style scoped>
.home-banner {
  position: absolute;
  top: -60px;
  left: 0;
  right: 0;
  height: 100vh;
  background: url("@/assets/img/6.jpg") center center / cover no-repeat;
  background-color: #49b1f5;
  background-attachment: fixed;
  text-align: center;
  color: #fff !important;
  animation: header-effect 1s;
}
.banner-container {
  margin-top: 43vh;
  line-height: 1.5;
  color: #eee;
}
.blog-contact a {
  color: #fff !important;
}
@media (min-width: 760px) {
  .blog-title {
    font-size: 2.5rem;
  }
  .blog-intro {
    font-size: 1.5rem;
  }
  .blog-contact {
    display: none;
  }
}
@media (max-width: 759px) {
  .blog-title {
    font-size: 26px;
  }
  .blog-contact {
    font-size: 1.25rem;
    line-height: 2;
  }
}
</style>
