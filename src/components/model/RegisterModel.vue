<template>
  <v-dialog
      v-model="registerFlag"
      :fullscreen="isMobile"
      max-width="800"
      content-class="dialog-transparent"
      overlay-opacity="0.7"
  >
    <v-card class="register-container">
      <!-- 关闭按钮 -->
      <v-icon class="close-btn" @click="registerFlag = false">mdi-close</v-icon>

      <!-- 左侧装饰区域 -->
      <div class="register-banner">
        <div class="banner-content">
          <h2>欢迎加入我们</h2>
          <p>在这里，发现更多精彩</p>
        </div>
      </div>

      <!-- 右侧注册区域 -->
      <div class="register-content">
        <h3 class="register-title">创建账号</h3>

        <!-- 注册方式切换 -->
        <v-tabs
            v-model="registerType"
            centered
            color="primary"
            background-color="transparent"
            slider-color="primary"
        >
          <v-tab>
            <v-icon left>mdi-email</v-icon>
            邮箱注册
          </v-tab>
          <v-tab>
            <v-icon left>mdi-cellphone</v-icon>
            手机注册
          </v-tab>
        </v-tabs>

        <v-tabs-items v-model="registerType" class="register-forms">
          <!-- 邮箱注册面板 -->
          <v-tab-item>
            <v-card flat>
              <v-card-text class="form-container">
                <div class="input-group">
                  <!-- 邮箱输入框 -->
                  <v-text-field
                      v-model="username"
                      label="邮箱"
                      prepend-inner-icon="mdi-email-outline"
                      outlined
                      dense
                      class="mb-2"
                      :rules="[rules.required, rules.email]"
                  />

                  <!-- 修改验证码输入框布局 -->
                  <div class="code-input-group mb-2">
                    <v-text-field
                        v-model="code"
                        label="验证码"
                        prepend-inner-icon="mdi-shield-outline"
                        outlined
                        dense
                        maxlength="6"
                        class="code-field"
                        :rules="[rules.required, rules.code]"
                    />
                    <v-btn
                        color="primary"
                        outlined
                        :disabled="flag"
                        @click="sendCode"
                        class="code-btn"
                        :height="40"
                    >
                      {{ codeMsg }}
                    </v-btn>
                  </div>

                  <!-- 密码输入框 -->
                  <v-text-field
                      v-model="password"
                      label="密码"
                      prepend-inner-icon="mdi-lock-outline"
                      :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
                      :type="show ? 'text' : 'password'"
                      @click:append="show = !show"
                      outlined
                      dense
                      class="mb-2"
                      :rules="[rules.required, rules.password]"
                  />
                </div>
              </v-card-text>
            </v-card>
          </v-tab-item>

          <!-- 手机注册面板 -->
          <v-tab-item>
            <v-card flat>
              <v-card-text class="form-container">
                <div class="input-group">
                  <!-- 手机号输入框 -->
                  <v-text-field
                      v-model="phone"
                      label="手机号"
                      prepend-inner-icon="mdi-cellphone"
                      outlined
                      dense
                      :rules="[rules.required, rules.phone]"
                  />

                  <!-- 修改为v-text-field的短信验证码输入框 -->
                  <div class="code-input-group">
                    <v-text-field
                        v-model="smsCode"
                        label="验证码"
                        prepend-inner-icon="mdi-shield-outline"
                        outlined
                        dense
                        maxlength="6"
                        class="code-field"
                        :rules="[rules.required, rules.code]"
                    />
                    <v-btn
                        color="primary"
                        outlined
                        :disabled="smsCooldown > 0"
                        @click="sendSmsCode"
                        class="code-btn"
                        height="40"
                    >
                      {{ smsCooldown > 0 ? `${smsCooldown}s` : '发送' }}
                    </v-btn>
                  </div>

                  <!-- 密码输入框 -->
                  <v-text-field
                      v-model="password"
                      label="密码"
                      prepend-inner-icon="mdi-lock-outline"
                      :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
                      :type="show ? 'text' : 'password'"
                      @click:append="show = !show"
                      outlined
                      dense
                      :rules="[rules.required, rules.password]"
                  />
                </div>
              </v-card-text>
            </v-card>
          </v-tab-item>
        </v-tabs-items>

        <!-- 注册按钮 -->
        <v-btn
            block
            x-large
            color="primary"
            elevation="2"
            @click="handleRegister"
            class="register-btn"
            :loading="loading"
        >
          立即注册
        </v-btn>

        <!-- 社交账号登录 -->
        <div class="social-login">
          <div class="divider">
            <span>社交账号直接注册</span>
          </div>
          <div class="social-icons">
            <v-btn icon large color="green" class="mx-2" @click="wechatLogin">
              <v-icon>mdi-wechat</v-icon>
            </v-btn>
            <v-btn icon large color="blue" class="mx-2" @click="qqLogin">
              <v-icon>mdi-qqchat</v-icon>
            </v-btn>
          </div>
        </div>

        <!-- 登录提示 -->
        <div class="login-tip">
          已有账号？<a @click="openLogin">立即登录</a>
        </div>
      </div>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  data: function() {
    return {
      username: "",
      code: "",
      password: "",
      flag: true,
      codeMsg: "发送",
      time: 60,
      show: false,

      registerType: 0,
      phone: "",
      smsCode: "",
      smsCooldown: 0,
      rules: {
        required: v => !!v || "此项是必须的",
        email: v => /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(v) || "邮箱格式不正确",
        phone: v => /^1[3-9]\d{9}$/.test(v) || "手机号格式不正确",
        code: v => /^\d{6}$/.test(v) || "验证码必须是6位数字",
        password: v => v.length >= 6 || "密码不能少于6位"
      },
      codeFocused: false,
      smsCodeFocused: false,
      debug: true,  // 添加调试标志
      loading: false, // 添加loading状态
      config: {
        // 请填写您的腾讯验证码应用ID
        TENCENT_CAPTCHA: 'Your_TENCENT_CAPTCHA_ID',
        // 请填写您的QQ应用ID
        QQ_APP_ID: 'Your_QQ_APP_ID',
        // 请填写您的QQ登录回调地址
        QQ_REDIRECT_URI: 'Your_QQ_REDIRECT_URI',
        // 请填写您的微信应用ID
        WECHAT_APP_ID: 'Your_WECHAT_APP_ID',
        // 请填写您的微信登录回调地址
        WECHAT_REDIRECT_URI: 'Your_WECHAT_REDIRECT_URI',
      },
    };
  },
  methods: {
    // 添加调试日志方法
    log(message, data) {
      if (this.debug) {
        if (typeof data !== "undefined") {
          console.log(`[RegisterModel] ${message}`, data);
          return;
        }
        console.log(`[RegisterModel] ${message}`);
      }
    },

    openLogin() {
      this.log('点击了登录按钮');
      this.$store.state.registerFlag = false;
      this.$store.state.loginFlag = true;
    },

    sendCode() {
      this.log('发送邮箱验证码');

      const emailValidation = this.rules.email(this.username);
      if (typeof emailValidation === 'string') {
        this.$toast({ type: "error", message: emailValidation });
        return;
      }

      const that = this;
      try {
        // 检查验证码组件是否存在
        if (typeof TencentCaptcha !== 'undefined') {
          var captcha = new TencentCaptcha(this.config.TENCENT_CAPTCHA, function(res) {
            that.log('验证码回调', res);

            if (res.ret === 0) {
              // 发送邮件
              that.countDown();
              that.axios
                  .get("/api/users/code", {
                    params: { username: that.username }
                  })
                  .then(({ data }) => {
                    that.log('验证码请求响应', data);

                    if (data.flag) {
                      that.$toast({ type: "success", message: data.message });
                    } else {
                      that.$toast({ type: "error", message: data.message });
                    }
                  })
                  .catch(error => {
                    that.log('验证码请求错误', error);
                    that.$toast({ type: "error", message: "验证码发送失败，请稍后再试" });
                  });
            }
          });

          captcha.show();
        } else {
          this.log('验证码组件未加载');
          this.$toast({ type: "error", message: "验证组件未加载，请刷新页面" });
        }
      } catch (error) {
        this.log('发送验证码错误', error);
        this.$toast({ type: "error", message: "发送验证码出错" });
      }
    },

    countDown() {
      this.log('开始倒计时');
      this.flag = true;
      this.timer = setInterval(() => {
        this.time--;
        this.codeMsg = this.time + "s";
        if (this.time <= 0) {
          clearInterval(this.timer);
          this.codeMsg = "发送";
          this.time = 60;
          this.flag = false;
        }
      }, 1000);
    },

    register() {
      this.log('点击注册按钮', {
        email: this.username,
        codeLength: this.code.length,
        passwordLength: this.password.length
      });

      // 邮箱格式验证 - 修复验证逻辑
      const emailValidation = this.rules.email(this.username);
      if (typeof emailValidation === 'string') {
        this.log('邮箱格式不正确');
        this.$toast({ type: "error", message: emailValidation });
        return false;
      }

      // 验证码验证 - 修复验证逻辑
      const codeValidation = this.rules.code(this.code);
      if (typeof codeValidation === 'string') {
        this.log('验证码格式不正确');
        this.$toast({ type: "error", message: codeValidation });
        return false;
      }

      // 密码验证 - 修复验证逻辑
      const passwordValidation = this.rules.password(this.password);
      if (typeof passwordValidation === 'string') {
        this.log('密码长度不足');
        this.$toast({ type: "error", message: passwordValidation });
        return false;
      }

      // 提交注册
      this.log('准备提交注册请求');
      const user = {
        username: this.username,
        password: this.password,
        code: this.code
      };

      this.$toast({ type: "info", message: "注册中，请稍候..." });

      return this.axios.post("/api/users", user)
          .then(({ data }) => {
            this.log('注册响应', data);

            if (data.flag) {
              this.log('注册成功，准备自动登录');

              // 注册成功后自动登录
              let param = new URLSearchParams();
              param.append("username", user.username);
              param.append("password", user.password);

              return this.axios.post("/api/login", param.toString(), { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } })
                  .then(({ data }) => {
                    this.log('自动登录响应', data);

                    if (data.flag) {
                      this.username = "";
                      this.password = "";
                      this.code = "";
                      this.$store.commit("login", data.data);
                      this.$store.commit("closeModel");
                      this.$toast({ type: "success", message: "注册成功并已登录" });
                    } else {
                      this.$toast({
                        type: "warning",
                        message: "注册成功，但自动登录失败，请手动登录"
                      });
                      this.openLogin();
                    }
                  })
                  .catch(error => {
                    this.log('自动登录请求错误', error);
                    this.$toast({
                      type: "warning",
                      message: "注册成功，但自动登录失败，请手动登录"
                    });
                    this.openLogin();
                  });
            }
            this.$toast({ type: "error", message: data.message });
            return null;
          })
          .catch(error => {
            this.log('注册请求错误', error);
            this.$toast({ type: "error", message: "注册失败，请稍后再试" });
          });
    },

    sendSmsCode() {
      this.log('发送短信验证码');

      const phoneValidation = this.rules.phone(this.phone);
      if (typeof phoneValidation === 'string') {
        this.$toast({ type: "error", message: phoneValidation });
        return;
      }

      const that = this;
      try {
        // 使用腾讯验证码
        if (typeof TencentCaptcha !== 'undefined') {
          var captcha = new TencentCaptcha(this.config.TENCENT_CAPTCHA, function(res) {
            that.log('短信验证码回调', res);

            if (res.ret === 0) {
              // 发送验证码请求
              that.axios.post("/api/users/sms/code", {
                username: that.phone
              }).then(({ data }) => {
                that.log('短信验证码响应', data);

                if (data.flag) {
                  that.$toast({ type: "success", message: "验证码已发送" });
                  // 开始倒计时
                  that.smsCooldown = 60;
                  const timer = setInterval(() => {
                    that.smsCooldown--;
                    if (that.smsCooldown <= 0) {
                      clearInterval(timer);
                    }
                  }, 1000);
                } else {
                  that.$toast({ type: "error", message: data.message });
                }
              });
            }
          });
          captcha.show();
        } else {
          this.log('短信验证码组件未加载');
          this.$toast({ type: "error", message: "验证组件未加载，请刷新页面" });
        }
      } catch (error) {
        this.log('发送短信验证码错误', error);
        this.$toast({ type: "error", message: "发送验证码出错" });
      }
    },

    registerByPhone() {
      this.log('手机注册', {
        phone: this.phone,
        codeLength: this.smsCode.length,
        passwordLength: this.password.length
      });

      // 手机号验证 - 修复验证逻辑
      const phoneValidation = this.rules.phone(this.phone);
      if (typeof phoneValidation === 'string') {
        this.log('手机号格式不正确');
        this.$toast({ type: "error", message: phoneValidation });
        return false;
      }

      // 验证码验证 - 修复验证逻辑
      const codeValidation = this.rules.code(this.smsCode);
      if (typeof codeValidation === 'string') {
        this.log('短信验证码格式不正确');
        this.$toast({ type: "error", message: codeValidation });
        return false;
      }

      // 密码验证 - 修复验证逻辑
      const passwordValidation = this.rules.password(this.password);
      if (typeof passwordValidation === 'string') {
        this.log('密码长度不足');
        this.$toast({ type: "error", message: passwordValidation });
        return false;
      }

      // 正确构造用户数据
      const user = {
        username: this.phone,
        password: this.password,
        code: this.smsCode
      };

      this.$toast({ type: "info", message: "注册中，请稍候..." });

      return this.axios.post("/api/users", user)
          .then(({ data }) => {
            this.log('手机注册响应', data);

            if (data.flag) {
              this.log('手机注册成功，准备自动登录');

              // 注册成功后自动登录
              let param = new URLSearchParams();
              param.append("username", user.username);
              param.append("password", user.password);
              param.append("loginType", "PHONE");

              return this.axios.post("/api/login", param.toString(), { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } })
                  .then(({ data }) => {
                    this.log('手机自动登录响应', data);

                    if (data.flag) {
                      this.phone = "";
                      this.password = "";
                      this.smsCode = "";
                      this.$store.commit("login", data.data);
                      this.$store.commit("closeModel");
                      this.$toast({ type: "success", message: "注册成功并已登录" });
                    } else {
                      this.$toast({
                        type: "warning",
                        message: "注册成功，但自动登录失败，请手动登录"
                      });
                      this.openLogin();
                    }
                  })
                  .catch(error => {
                    console.error("API错误:", {
                      status: error.response?.status,
                      statusText: error.response?.statusText,
                      data: error.response?.data,
                      url: error.config?.url
                    });
                    this.$toast({
                      type: "error",
                      message: `注册失败: ${error.response?.data?.message || error.message || '未知错误'}`
                    });
                  });
            }
            this.$toast({ type: "error", message: data.message });
            return null;
          })
          .catch(error => {
            console.error("API错误:", {
              status: error.response?.status,
              statusText: error.response?.statusText,
              data: error.response?.data,
              url: error.config?.url
            });
            this.$toast({
              type: "error",
              message: `注册失败: ${error.response?.data?.message || error.message || '未知错误'}`
            });
          });
    },

    // 添加缺失的社交登录方法
    wechatLogin() {
      this.log('微信登录/注册');
      this.$toast({ type: "info", message: "正在跳转到微信登录..." });

      // 保存当前路径
      this.$store.commit("saveLoginUrl", this.$route.path);

      // 跳转到微信扫码页面
      try {
        if (this.config && this.config.WECHAT_APP_ID && this.config.WECHAT_REDIRECT_URI) {
          window.open(
              "https://open.weixin.qq.com/connect/qrconnect?appid=" +
              this.config.WECHAT_APP_ID +
              "&redirect_uri=" +
              encodeURIComponent(this.config.WECHAT_REDIRECT_URI) +
              "&response_type=code&scope=snsapi_login&state=STATE#wechat_redirect",
              "_self"
          );
        } else {
          this.log('微信登录配置缺失');
          this.$toast({ type: "error", message: "微信登录未配置" });
        }
      } catch (error) {
        this.log('微信登录错误', error);
        this.$toast({ type: "error", message: "微信登录跳转失败" });
      }
    },

    qqLogin() {
      this.log('QQ登录/注册');
      this.$toast({ type: "info", message: "正在跳转到QQ登录..." });

      // 保存当前路径
      this.$store.commit("saveLoginUrl", this.$route.path);

      try {
        if (this.config && this.config.QQ_APP_ID && this.config.QQ_REDIRECT_URI) {
          window.open(
              "https://graph.qq.com/oauth2.0/show?which=Login&display=pc&client_id=" +
              this.config.QQ_APP_ID +
              "&response_type=token&scope=all&redirect_uri=" +
              this.config.QQ_REDIRECT_URI,
              "_self"
          );
        } else {
          this.log('QQ登录配置缺失');
          this.$toast({ type: "error", message: "QQ登录未配置" });
        }
      } catch (error) {
        this.log('QQ登录错误', error);
        this.$toast({ type: "error", message: "QQ登录跳转失败" });
      }
    },

    // 添加新的处理方法
    handleRegister() {
      this.log('注册按钮被点击');
      if (this.loading) {
        return;
      }

      this.loading = true;
      try {
        const registerPromise = this.registerType === 0
            ? this.register()
            : this.registerByPhone();

        Promise.resolve(registerPromise).finally(() => {
          this.loading = false;
        });
      } catch (error) {
        this.log('注册处理出错', error);
        this.$toast({ type: "error", message: "注册处理出错，请重试" });
        this.loading = false;
      }
    },

  },
  computed: {
    registerFlag: {
      set(value) {
        this.$store.state.registerFlag = value;
      },
      get() {
        return this.$store.state.registerFlag;
      }
    },
    isMobile() {
      const clientWidth = document.documentElement.clientWidth;
      if (clientWidth > 960) {
        return false;
      }
      return true;
    }
  },
  watch: {
    username(value) {
      var reg = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
      if (reg.test(value)) {
        this.flag = false;
      } else {
        this.flag = true;
      }
    }
  },
  created() {
    this.log('注册组件已创建');

    // 确保config对象存在
    if (!this.config) {
      // 配置第三方登录信息，请替换为您自己的应用信息
      this.config = {
        // 腾讯验证码ID，请替换为您的验证码ID
        TENCENT_CAPTCHA: 'Your_TENCENT_CAPTCHA_ID',
        // QQ应用ID，请替换为您的QQ应用ID
        QQ_APP_ID: 'Your_QQ_APP_ID',
        // QQ登录回调地址，请替换为您的回调地址
        QQ_REDIRECT_URI: 'Your_QQ_REDIRECT_URI',
        // 微信应用ID，请替换为您的微信应用ID
        WECHAT_APP_ID: 'Your_WECHAT_APP_ID',
        // 微信登录回调地址，请替换为您的回调地址
        WECHAT_REDIRECT_URI: 'Your_WECHAT_REDIRECT_URI',
      };
      this.log('初始化配置完成', this.config);
    }
  },
  mounted() {
    this.log('注册组件已挂载');
  }
};
</script>

<style scoped>
.register-container {
  display: flex;
  min-height: 600px;
  overflow: hidden;
  border-radius: 12px !important;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2) !important;
}

.close-btn {
  position: absolute;
  top: 16px;
  right: 16px;
  z-index: 10;
  cursor: pointer;
  color: #ffffff !important;
  background-color: rgba(0, 0, 0, 0.3);
  border-radius: 50%;
  padding: 4px;
}

.register-banner {
  flex: 1;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  padding: 40px;
  text-align: center;
  position: relative;
  overflow: hidden;
}

.register-banner::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%);
}

.banner-content {
  position: relative;
  z-index: 2;
}

.banner-content h2 {
  font-size: 2.8em;
  margin-bottom: 16px;
  font-weight: 600;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

.banner-content p {
  font-size: 1.3em;
  opacity: 0.9;
  text-shadow: 0 1px 8px rgba(0, 0, 0, 0.3);
}

.register-content {
  flex: 1;
  padding: 40px;
  display: flex;
  flex-direction: column;
  position: relative;
}

.register-title {
  text-align: center;
  font-size: 2em;
  margin-bottom: 28px;
  font-weight: 600;
}

.register-forms {
  margin-top: 20px;
  margin-bottom: 20px;
}

.form-container {
  padding: 20px 0 !important;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 12px !important;
}

.code-input-group {
  display: flex;
  align-items: flex-start !important;
  margin-bottom: 8px;
}

.code-field {
  flex: 1;
  margin-right: 12px;
  margin-bottom: 0 !important;
}

.code-btn {
  min-width: 80px !important;
  margin-top: 0 !important;
  align-self: center !important;
}

.register-btn {
  margin: 28px 0;
  height: 54px !important;
  border-radius: 8px !important;
  font-size: 16px !important;
  text-transform: none !important;
  letter-spacing: 0.5px !important;
  font-weight: 500 !important;
  box-shadow: 0 4px 12px rgba(25, 118, 210, 0.3) !important;
  transition: all 0.3s !important;
}

.register-btn:hover {
  transform: translateY(-2px) !important;
  box-shadow: 0 6px 16px rgba(25, 118, 210, 0.4) !important;
}

.social-login {
  margin-top: 28px;
}

.divider {
  text-align: center;
  position: relative;
  margin: 24px 0;
}

.divider::before,
.divider::after {
  content: '';
  position: absolute;
  top: 50%;
  width: 45%;
  height: 1px;
  background-color: #e0e0e0;
}

.divider::before {
  left: 0;
}

.divider::after {
  right: 0;
}

.divider span {
  padding: 0 12px;
  font-size: 0.9em;
  position: relative;
  z-index: 1;
}

.social-icons {
  display: flex;
  justify-content: center;
  margin-top: 20px;
  gap: 20px;
}

.login-tip {
  text-align: center;
  margin-top: 24px;
  font-size: 15px;
}

.login-tip a {
  font-weight: 500;
  transition: all 0.2s;
}

.login-tip a:hover {
  text-decoration: underline;
}

@media (max-width: 960px) {
  .register-container {
    flex-direction: column;
  }

  .register-banner {
    padding: 24px;
    min-height: 180px;
  }

  .banner-content h2 {
    font-size: 2.2em;
  }

  .banner-content p {
    font-size: 1.1em;
  }

  .register-content {
    padding: 24px;
  }

  .register-title {
    font-size: 1.8em;
    margin-bottom: 20px;
  }

  .register-btn {
    margin: 20px 0;
    height: 48px !important;
  }

  .social-icons {
    gap: 15px;
  }
}

.theme--dark .register-container,
[data-theme='dark'] .register-container,
body.theme-dark .register-container {
  background-color: #1e1e1e !important;
  color: #ffffff !important;
}

.theme--dark .register-content,
[data-theme='dark'] .register-content,
body.theme-dark .register-content {
  background-color: #1e1e1e !important;
  color: #ffffff !important;
}

.theme--dark .register-title,
[data-theme='dark'] .register-title,
body.theme-dark .register-title {
  color: #ffffff !important;
}

.theme--dark .divider span,
[data-theme='dark'] .divider span,
body.theme-dark .divider span {
  background-color: #1e1e1e !important;
  color: #aaa !important;
}

.theme--dark .divider::before,
.theme--dark .divider::after,
[data-theme='dark'] .divider::before,
[data-theme='dark'] .divider::after,
body.theme-dark .divider::before,
body.theme-dark .divider::after {
  background-color: #444444 !important;
}

.theme--dark .login-tip,
[data-theme='dark'] .login-tip,
body.theme-dark .login-tip {
  color: #cccccc !important;
}

.theme--dark .login-tip a,
[data-theme='dark'] .login-tip a,
body.theme-dark .login-tip a {
  color: #49b1f5 !important;
}

.theme--dark .custom-input-field,
[data-theme='dark'] .custom-input-field,
body.theme-dark .custom-input-field {
  background-color: #2c2c2c !important;
  border-color: #444444 !important;
}

.theme--dark .custom-label,
[data-theme='dark'] .custom-label,
body.theme-dark .custom-label {
  color: rgba(255, 255, 255, 0.7) !important;
}

.theme--dark .custom-label.float-label,
[data-theme='dark'] .custom-label.float-label,
body.theme-dark .custom-label.float-label {
  background-color: #1e1e1e !important;
}

.theme--dark .custom-input,
[data-theme='dark'] .custom-input,
body.theme-dark .custom-input {
  color: #ffffff !important;
}

.theme--dark .custom-button,
[data-theme='dark'] .custom-button,
body.theme-dark .custom-button {
  color: #49b1f5 !important;
  border-color: #49b1f5 !important;
}

.theme--dark .custom-button:hover:not(:disabled),
[data-theme='dark'] .custom-button:hover:not(:disabled),
body.theme-dark .custom-button:hover:not(:disabled) {
  background-color: rgba(73, 177, 245, 0.1) !important;
}

.theme--dark .social-icons .v-btn,
[data-theme='dark'] .social-icons .v-btn,
body.theme-dark .social-icons .v-btn {
  border: 1px solid rgba(255, 255, 255, 0.2) !important;
}

.theme--dark .v-tabs,
[data-theme='dark'] .v-tabs,
body.theme-dark .v-tabs {
  color: #ffffff !important;
}

.theme--dark .v-tab,
[data-theme='dark'] .v-tab,
body.theme-dark .v-tab {
  color: rgba(255, 255, 255, 0.7) !important;
}

.theme--dark .v-tab--active,
[data-theme='dark'] .v-tab--active,
body.theme-dark .v-tab--active {
  color: #49b1f5 !important;
}

.theme--dark .v-card.v-sheet,
[data-theme='dark'] .v-card.v-sheet,
body.theme-dark .v-card.v-sheet {
  background-color: transparent !important;
}

.theme--dark .v-text-field >>> .v-input__slot,
[data-theme='dark'] .v-text-field >>> .v-input__slot,
body.theme-dark .v-text-field >>> .v-input__slot {
  background-color: #2c2c2c !important;
  border-color: #444444 !important;
}

.theme--dark .v-text-field >>> input,
[data-theme='dark'] .v-text-field >>> input,
body.theme-dark .v-text-field >>> input {
  color: #ffffff !important;
}

.theme--dark .v-text-field >>> .v-label,
[data-theme='dark'] .v-text-field >>> .v-label,
body.theme-dark .v-text-field >>> .v-label {
  color: rgba(255, 255, 255, 0.7) !important;
}

:deep(.v-dialog) {
  background-color: transparent !important;
  box-shadow: none !important;
}

:deep(.v-dialog__content) {
  background-color: transparent !important;
}

:deep(.v-overlay__scrim) {
  background-color: rgba(0, 0, 0, 0.7) !important;
}

.theme--dark.v-application .v-dialog,
[data-theme='dark'] .v-application .v-dialog,
body.theme-dark .v-application .v-dialog {
  background-color: transparent !important;
  box-shadow: none !important;
}

.theme--dark.v-application .v-dialog__content,
[data-theme='dark'] .v-application .v-dialog__content,
body.theme-dark .v-application .v-dialog__content {
  background-color: transparent !important;
}

.theme--dark.v-application .v-overlay__scrim,
[data-theme='dark'] .v-application .v-overlay__scrim,
body.theme-dark .v-application .v-overlay__scrim {
  background-color: rgba(0, 0, 0, 0.7) !important;
}

/* 深色模式下验证码输入组样式 */
.theme--dark .code-input-group .v-btn,
[data-theme='dark'] .code-input-group .v-btn,
body.theme-dark .code-input-group .v-btn {
  border-color: rgba(73, 177, 245, 0.7) !important;
  color: #49b1f5 !important;
}

.theme--dark .code-input-group .v-btn:hover,
[data-theme='dark'] .code-input-group .v-btn:hover,
body.theme-dark .code-input-group .v-btn:hover {
  background-color: rgba(73, 177, 245, 0.1) !important;
}

/* 强制控制输入框高度一致性 */
:deep(.v-input__slot) {
  min-height: 40px !important;
  max-height: 40px !important;
}

:deep(.v-text-field__slot) {
  height: 40px !important;
}

/* 密码可见性图标位置调整 */
:deep(.v-input__append-inner) {
  margin-top: 8px !important;
}

:deep(.v-input__prepend-inner) {
  margin-top: 8px !important;
}

/* 移除文本字段底部多余的间距 */
:deep(.v-text-field.v-text-field--enclosed .v-text-field__details) {
  margin-bottom: 0 !important;
  padding-bottom: 0 !important;
  height: 0 !important;
}

/* 调整整体表单边距 */
.form-container {
  padding: 12px 0 !important;
}

/* 手机注册面板使用相同的样式规则 */
.v-tab-item .input-group {
  gap: 8px !important;
}

/* 确保所有表单字段强制使用相同的高度 */
.v-text-field.v-text-field--outlined,
.v-input--dense.v-text-field--outlined >>> .v-input__control {
  min-height: 45px !important;
  max-height: 45px !important;
}

/* 验证码输入组样式 */
.code-input-group {
  display: flex;
  align-items: flex-start !important;
  margin-bottom: 8px;
}

.code-field {
  flex: 1;
  margin-right: 12px;
  margin-bottom: 0 !important;
}

.code-btn {
  min-width: 80px !important;
  margin-top: 0 !important;
  align-self: center !important;
}

/* 确保验证码按钮与输入框高度一致 */
:deep(.code-btn) {
  height: 40px !important;
}

/* 确保错误提示不会影响布局 */
:deep(.v-text-field__details) {
  position: absolute;
  bottom: -20px;
  width: 100%;
  min-height: 0 !important;
}

/* 确保输入框高度一致 */
:deep(.v-input__control) {
  min-height: 40px !important;
}

/* 添加在深色模式相关样式部分 */
.theme--dark .social-icons .v-btn.black--text,
[data-theme='dark'] .social-icons .v-btn.black--text,
body.theme-dark .social-icons .v-btn.black--text {
  color: #ffffff !important;
  background-color: rgba(255, 255, 255, 0.1) !important;
}
</style>
