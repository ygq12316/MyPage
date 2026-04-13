<template>
  <div class="oauth-background">
    <div id="preloader_1">
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
    </div>
  </div>
</template>

<script>
/* eslint-disable no-undef */
export default {
  created() {
    // 关闭登录框
    this.$store.state.loginFlag = false;
    
    // 获取URL中的code参数
    const code = this.$route.query.code;
    
    if (!code) {
      this.$toast({ type: "error", message: "无效的登录请求" });
      this.$router.push('/');
      return;
    }
    
    this.$toast({ type: "info", message: "正在处理登录..." });
    
    // 根据路径确定登录类型并处理
    if (this.$route.path === "/oauth/login/github") {
      // GitHub登录处理
      this.handleGithubLogin(code);
    } else if (this.$route.path === "/oauth/login/weibo") {
      // 微博登录处理
      this.handleWeiboLogin(code);
    } else if (this.$route.path === "/oauth/login/qq") {
      // QQ登录处理
      this.handleQQLogin(code);
    } else {
      // 未知登录类型
      this.$toast({ type: "error", message: "未知的登录类型" });
      this.$router.push('/');
    }
  },
  
  methods: {
    handleGithubLogin(code) {
      this.axios.get(`/api/users/oauth/github?code=${code}`)
        .then(({ data }) => {
          this.handleLoginResponse(data);
        })
        .catch(this.handleLoginError);
    },
    
    handleWeiboLogin(code) {
      this.axios.get(`/api/users/oauth/weibo?code=${code}`)
        .then(({ data }) => {
          this.handleLoginResponse(data);
        })
        .catch(this.handleLoginError);
    },
    
    handleQQLogin(code) {
      // 使用code参数从QQ获取token和openid
      this.axios.get(`/api/users/oauth/qq/callback?code=${code}`)
        .then(({ data }) => {
          this.handleLoginResponse(data);
        })
        .catch(this.handleLoginError);
    },
    
    loadQQSDK() {
      return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://connect.qq.com/qc_jssdk.js';
        script.async = true;
        
        script.onload = () => {
          resolve();
        };
        
        script.onerror = () => {
          reject(new Error('QQ SDK加载失败'));
        };
        
        document.head.appendChild(script);
      });
    },
    
    processQQLogin() {
      const that = this;
      try {
        // 拿到openId，accessToken传入后台
        if (typeof QC !== 'undefined' && QC.Login && QC.Login.check()) {
          QC.Login.getMe(function(openId, accessToken) {
            let param = new URLSearchParams();
            param.append("openId", openId);
            param.append("accessToken", accessToken);
            that.axios.post("/api/users/oauth/qq", param)
              .then(({ data }) => {
                that.handleLoginResponse(data);
              })
              .catch(that.handleLoginError);
          });
        } else {
          that.$toast({ type: "error", message: "QQ登录失败，未能获取授权信息" });
          that.$router.push('/');
        }
      } catch {
        that.$toast({ type: "error", message: "QQ登录处理出错" });
        that.$router.push('/');
      }
    },
    
    handleLoginResponse(data) {
      if (data.flag) {
        // 保存登录状态
        this.$store.commit("login", data.data);
        
        // 检查邮箱是否存在
        if (data.data.email == null) {
          this.$toast({
            type: "warning",
            message: "请绑定邮箱以便及时收到回复"
          });
        } else {
          this.$toast({ type: "success", message: data.message || "登录成功" });
        }
        
        // 跳转回原页面
        this.$router.push(this.$store.state.loginUrl || '/');
      } else {
        this.$toast({ type: "error", message: data.message || "登录失败" });
        this.$router.push('/');
      }
    },
    
    handleLoginError() {
      this.$toast({ type: "error", message: "登录请求失败，请稍后重试" });
      this.$router.push('/');
    }
  }
};
</script>

<style scoped>
.oauth-background {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: #fff;
  z-index: 1000;
}
#preloader_1 {
  position: relative;
  top: 45vh;
  left: 45vw;
}
#preloader_1 span {
  display: block;
  bottom: 0px;
  width: 9px;
  height: 5px;
  background: #9b59b6;
  position: absolute;
  animation: preloader_1 1.5s infinite ease-in-out;
}
#preloader_1 span:nth-child(2) {
  left: 11px;
  animation-delay: 0.2s;
}
#preloader_1 span:nth-child(3) {
  left: 22px;
  animation-delay: 0.4s;
}
#preloader_1 span:nth-child(4) {
  left: 33px;
  animation-delay: 0.6s;
}
#preloader_1 span:nth-child(5) {
  left: 44px;
  animation-delay: 0.8s;
}
@keyframes preloader_1 {
  0% {
    height: 5px;
    transform: translateY(0px);
    background: #9b59b6;
  }
  25% {
    height: 30px;
    transform: translateY(15px);
    background: #3498db;
  }
  50% {
    height: 5px;
    transform: translateY(0px);
    background: #9b59b6;
  }
  100% {
    height: 5px;
    transform: translateY(0px);
    background: #9b59b6;
  }
}
</style>
