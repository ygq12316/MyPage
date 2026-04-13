<template>
  <v-dialog
      v-model="loginFlag"
      :fullscreen="isMobile"
      max-width="900"
      height="1000"
      content-class="dialog-transparent"
      overlay-opacity="0.7"
  >
    <v-card class="login-container">
      <!-- 关闭按钮 -->
      <v-icon class="close-btn" @click="loginFlag = false">mdi-close</v-icon>

      <!-- 左侧装饰区域 -->
      <div class="login-banner">
        <div class="banner-content">
          <h2>Welcome to Back</h2>
          <p>Welcome to AllureBlog</p>
        </div>
      </div>

      <!-- 右侧登录区域 -->
      <div class="login-content">
        <h3 class="login-title">账号登录</h3>

        <!-- 登录方式切换 -->
        <v-tabs
            v-model="loginType"
            centered
            color="primary"
            background-color="transparent"
            slider-color="primary"
        >
          <v-tab>
            <v-icon left>mdi-email</v-icon>
            邮箱登录
          </v-tab>
          <v-tab>
            <v-icon left>mdi-cellphone</v-icon>
            手机登录
          </v-tab>
        </v-tabs>

        <v-tabs-items v-model="loginType" class="login-forms">
          <!-- 邮箱登录面板 -->
          <v-tab-item>
            <!-- 邮箱输入框 -->
            <v-text-field
                v-model="username"
                label="邮箱号"
                placeholder="请输入您的邮箱号"
                prepend-inner-icon="mdi-email-outline"
                outlined
                class="mt-6"
                height="56"
                @keyup.enter="handleLogin"
                @blur="validateOnBlur('email')"
                :error-messages="emailError"
                :error="!!emailError"
                persistent-hint
            />
            <!-- 密码输入框 -->
            <v-text-field
                v-model="password"
                label="密码"
                placeholder="请输入您的密码"
                prepend-inner-icon="mdi-lock-outline"
                :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
                :type="show ? 'text' : 'password'"
                @click:append="show = !show"
                outlined
                height="56"
                class="mt-4"
                @keyup.enter="handleLogin"
                @blur="validateOnBlur('password')"
                :error-messages="passwordError"
                :error="!!passwordError"
                persistent-hint
                hide-details="auto"
            />
          </v-tab-item>

          <!-- 手机登录面板 -->
          <v-tab-item>
            <!-- 手机号输入框 -->
            <v-text-field
                v-model="phone"
                label="手机号"
                placeholder="请输入您的手机号"
                prepend-inner-icon="mdi-cellphone"
                outlined
                height="56"
                class="mt-6"
                @keyup.enter="handleLogin"
                @blur="validateOnBlur('phone')"
                :error-messages="phoneError"
                :error="!!phoneError"
                persistent-hint
            />
            <!-- 密码输入框 -->
            <v-text-field
                v-model="phonePassword"
                label="密码"
                placeholder="请输入您的密码"
                prepend-inner-icon="mdi-lock-outline"
                :append-icon="showPhonePassword ? 'mdi-eye' : 'mdi-eye-off'"
                :type="showPhonePassword ? 'text' : 'password'"
                @click:append="showPhonePassword = !showPhonePassword"
                outlined
                height="56"
                class="mt-4"
                @keyup.enter="handleLogin"
                @blur="validateOnBlur('phonePassword')"
                :error-messages="phonePasswordError"
                :error="!!phonePasswordError"
                persistent-hint
                hide-details="auto"
            />
          </v-tab-item>
        </v-tabs-items>

        <!-- 忘记密码 -->
        <div class="forget-password">
          <a @click="openForget">忘记密码?</a>
        </div>

        <!-- 登录按钮 -->
        <v-btn
            block
            x-large
            color="primary"
            height="56"
            elevation="2"
            @click="handleLogin"
            class="login-btn"
            :loading="loading"
        >
          立即登录
        </v-btn>

        <!-- 社交账号登录区域 - 改进的部分 -->
        <div class="social-section">
          <div class="divider-text">
            <span>社交账号直接登录</span>
          </div>

          <div class="social-icon-group">
            <v-btn icon large color="green" class="mx-2" @click="wechatLogin">
              <v-icon>mdi-wechat</v-icon>
            </v-btn>
            <v-btn icon large color="blue" class="mx-2" @click="qqLogin">
              <v-icon>mdi-qqchat</v-icon>
            </v-btn>
          </div>
        </div>

        <!-- 注册提示 - 改进的部分 -->
        <div class="signup-prompt">
          <span>还没有账号？</span>
          <a @click="openRegister" class="signup-link">立即注册</a>
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
      password: "",
      show: false,
      loginType: 0,
      phone: "",
      phonePassword: "",
      showPhonePassword: false,
      showSmsLogin: false,
      smsCode: "",
      cooldown: 0,
      debug: true, // 开启调试模式
      emailError: '',
      phoneError: '',
      passwordError: '',
      phonePasswordError: '',
      loading: false,
      rules: {
        email: (v) => {
          if (!v) return "邮箱地址不能为空";
          const pattern = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
          if (!pattern.test(v)) return "请输入正确的邮箱地址格式，如：example@domain.com";
          return true;
        },
        phone: (v) => {
          if (!v) return "手机号码不能为空";
          const pattern = /^1[3-9]\d{9}$/;
          if (!pattern.test(v)) return "请输入正确的11位手机号码";
          return true;
        },
        password: (v) => {
          if (!v) return "密码不能为空";
          if (v.length < 6) return "密码长度不能少于6位";
          if (v.length > 20) return "密码长度不能超过20位";
          return true;
        }
      },
      smsCodeFocused: false,
      config: {
        // 腾讯验证码配置（此处应替换为您的实际配置）
        TENCENT_CAPTCHA: 'YOUR_TENCENT_CAPTCHA_ID',
        // QQ登录配置
        QQ_APP_ID: 'YOUR_QQ_APP_ID',
        QQ_REDIRECT_URI: 'https://your-domain.com/oauth/login/qq',
        // 微信登录配置
        WECHAT_APP_ID: 'YOUR_WECHAT_APP_ID',
        WECHAT_REDIRECT_URI: 'https://your-domain.com/oauth/login/wechat',
      }
    };
  },
  computed: {
    loginFlag: {
      set(value) {
        this.$store.state.loginFlag = value;
      },
      get() {
        return this.$store.state.loginFlag;
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
  methods: {
    log(message, data) {
      if (!this.debug) {
        return;
      }
      if (typeof data !== "undefined") {
        console.log(`[LoginModel] ${message}`, data);
        return;
      }
      console.log(`[LoginModel] ${message}`);
    },

    openRegister() {
      this.$store.state.loginFlag = false;
      this.$store.state.registerFlag = true;
    },

    openForget() {
      this.$store.state.loginFlag = false;
      this.$store.state.forgetFlag = true;
    },

    handleLogin() {
      if (this.loading) {
        return;
      }

      console.log("处理登录请求，类型:", this.loginType);

      // 提交时验证所有字段
      if (!this.validateAll()) {
        return;
      }

      this.loading = true;
      try {
        if (this.loginType === 0) {
          console.log("调用邮箱登录");
          this.login();
        } else {
          console.log("调用手机登录");
          this.phoneLogin();
        }
      } catch (error) {
        console.error("登录处理错误:", error);
        this.$toast({ type: "error", message: "登录处理出错，请重试" });
        this.loading = false;
      }
    },

    validateEmail() {
      const result = this.rules.email(this.username);
      if (result !== true) {
        this.$toast({ type: "error", message: result });
        return false;
      }
      return true;
    },

    validatePhone() {
      const result = this.rules.phone(this.phone);
      if (result !== true) {
        this.$toast({ type: "error", message: result });
        return false;
      }
      return true;
    },

    validatePassword(password, type = 'email') {
      const result = this.rules.password(password);
      if (result !== true) {
        this.$toast({ type: "error", message: result });
        return false;
      }
      return true;
    },

    login() {
      let param = new URLSearchParams();
      param.append("username", this.username);
      param.append("password", this.password);

      this.$toast({ type: "info", message: "登录中，请稍候..." });

      this.axios.post("/api/login", param, { 
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      })
          .then(({ data }) => {
            if (data.flag) {
              this.username = "";
              this.password = "";
              this.$store.commit("login", data.data);
              this.$store.commit("closeModel");
              this.$toast({ type: "success", message: data.message });
            } else {
              this.$toast({ type: "error", message: data.message || "用户名或密码错误" });
            }
          })
          .catch(error => {
            console.error("登录请求错误:", error);
            const backendMessage =
              error &&
              error.response &&
              error.response.data &&
              error.response.data.message;
            const message =
              backendMessage ||
              (error && error.message ? error.message : "网络连接错误，请稍后重试");
            this.$toast({ type: "error", message });
          })
          .finally(() => {
            this.loading = false;
          });
    },

    // 尝试使用腾讯验证码登录
    tryTencentCaptcha() {
      this.log('尝试使用腾讯验证码');

      const that = this;

      try {
        // 检查配置对象
        if (!this.config || !this.config.TENCENT_CAPTCHA) {
          this.log('配置对象缺失', this.config);
          this.$toast({ type: "error", message: "验证配置缺失" });
          return;
        }

        // 尝试初始化并显示验证码
        // eslint-disable-next-line no-undef
        var captcha = new TencentCaptcha(this.config.TENCENT_CAPTCHA, function(res) {
          that.log('验证码回调', res);

          if (res.ret === 0) {
            that.log('验证码验证通过');

            let param = new URLSearchParams();
            param.append("username", that.username);
            param.append("password", that.password);

            that.log('发送验证后的登录请求');

            that.axios.post("/api/login", param).then(({ data }) => {
              that.log('验证后登录响应', data);

              if (data.flag) {
                that.username = "";
                that.password = "";
                that.$store.commit("login", data.data);
                that.$store.commit("closeModel");
                that.$toast({ type: "success", message: data.message });
              } else {
                that.$toast({ type: "error", message: data.message });
              }
            }).catch(error => {
              that.log('验证后登录请求异常', error);
              that.$toast({ type: "error", message: "登录失败，请稍后再试" });
            });
          } else {
            that.log('验证码验证未通过', res);
            that.$toast({ type: "warning", message: "验证未通过，请重试" });
          }
        });

        this.log('显示验证码');
        captcha.show();
      } catch (error) {
        this.log('验证码加载异常', error);

        this.$toast({ type: "error", message: "验证组件加载失败" });
      }
    },

    phoneLogin() {
      // 移除可能有问题的log函数调用
      // this.log('触发手机登录方法');
      console.log('触发手机登录方法'); // 改用标准console.log

      // 先进行本地验证
      if (!this.validatePhone() || !this.validatePassword(this.phonePassword, 'phone')) {
        return;
      }

      let param = new URLSearchParams();
      param.append("username", this.phone);
      param.append("password", this.phonePassword);

      this.$toast({ type: "info", message: "登录中，请稍候..." });

      console.log("发送手机登录请求:", this.phone); // 添加请求日志

      this.axios.post("/api/login", param, { 
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      })
          .then(({ data }) => {
            console.log("手机登录响应:", data); // 添加响应日志
            if (data.flag) {
              this.phone = "";
              this.phonePassword = "";
              this.$store.commit("login", data.data);
              this.$store.commit("closeModel");
              this.$toast({ type: "success", message: data.message });
            } else {
              this.$toast({ type: "error", message: data.message || "登录失败" });
            }
          })
          .catch(error => {
            // 详细记录错误信息
            console.error("手机登录错误:", error);
            if (error.response) {
              console.error("错误状态:", error.response.status);
              console.error("错误数据:", error.response.data);
            }
            const backendMessage =
              error &&
              error.response &&
              error.response.data &&
              error.response.data.message;
            const message =
              backendMessage ||
              (error && error.message ? error.message : "登录失败，请检查网络连接或稍后重试");
            this.$toast({ type: "error", message });
          })
          .finally(() => {
            this.loading = false;
          });
    },

    qqLogin() {
      // 显示加载提示
      this.$toast({ type: "info", message: "正在准备QQ登录..." });

      // 保存当前路径
      this.$store.commit("saveLoginUrl", this.$route.path);

      // 检查SDK是否加载
      if (typeof QC === 'undefined') {
        // 如果没有加载，先加载SDK
        this.loadQQSDK()
            .then(() => this.performQQLogin())
            .catch(error => {
              console.error('QQ登录SDK加载失败', error);
              this.$toast({ type: "error", message: "QQ登录服务暂时不可用，请稍后再试" });

              // 如果SDK加载失败，直接使用URL跳转方式
              this.qqLoginFallback();
            });
      } else {
        // SDK已加载，直接执行登录
        this.performQQLogin();
      }
    },

    wechatLogin() {
      // this.log('触发微信登录');

      // 保存当前路径
      this.$store.commit("saveLoginUrl", this.$route.path);

      // 跳转到微信扫码页面
      window.open(
          "https://open.weixin.qq.com/connect/qrconnect?appid=" +
          this.config.WECHAT_APP_ID +
          "&redirect_uri=" +
          encodeURIComponent(this.config.WECHAT_REDIRECT_URI) +
          "&response_type=code&scope=snsapi_login&state=STATE#wechat_redirect",
          "_self"
      );
    },

    // 实时验证输入
    handleInput(type) {
      switch(type) {
        case 'email':
          if (this.username) {
            const result = this.rules.email(this.username);
            this.emailError = result === true ? '' : result;
          }
          break;
        case 'phone':
          if (this.phone) {
            const result = this.rules.phone(this.phone);
            this.phoneError = result === true ? '' : result;
          }
          break;
        case 'password':
          if (this.password) {
            const result = this.rules.password(this.password);
            this.passwordError = result === true ? '' : result;
          }
          break;
        case 'phonePassword':
          if (this.phonePassword) {
            const result = this.rules.password(this.phonePassword);
            this.phonePasswordError = result === true ? '' : result;
          }
          break;
      }
    },

    // 失焦时验证
    validateOnBlur(type) {
      switch(type) {
        case 'email':
          const emailResult = this.rules.email(this.username);
          this.emailError = emailResult === true ? '' : emailResult;
          break;
        case 'phone':
          const phoneResult = this.rules.phone(this.phone);
          this.phoneError = phoneResult === true ? '' : phoneResult;
          break;
        case 'password':
          const passwordResult = this.rules.password(this.password);
          this.passwordError = passwordResult === true ? '' : passwordResult;
          break;
        case 'phonePassword':
          const phonePasswordResult = this.rules.password(this.phonePassword);
          this.phonePasswordError = phonePasswordResult === true ? '' : phonePasswordResult;
          break;
      }
    },

    // 提交时验证所有字段
    validateAll() {
      let isValid = true;

      if (this.loginType === 0) {
        // 邮箱登录验证
        const emailResult = this.rules.email(this.username);
        this.emailError = emailResult === true ? '' : emailResult;
        const passwordResult = this.rules.password(this.password);
        this.passwordError = passwordResult === true ? '' : passwordResult;

        isValid = emailResult === true && passwordResult === true;
      } else {
        // 手机登录验证
        const phoneResult = this.rules.phone(this.phone);
        this.phoneError = phoneResult === true ? '' : phoneResult;
        const phonePasswordResult = this.rules.password(this.phonePassword);
        this.phonePasswordError = phonePasswordResult === true ? '' : phonePasswordResult;

        isValid = phoneResult === true && phonePasswordResult === true;
      }

      return isValid;
    },

    // 清除错误信息
    clearErrors() {
      this.emailError = '';
      this.phoneError = '';
      this.passwordError = '';
      this.phonePasswordError = '';
    },

    // 切换登录类型时清除错误信息
    handleLoginTypeChange() {
      this.clearErrors();
    },

    // 添加方法：加载QQ登录SDK
    loadQQSDK() {
      if (typeof QC !== 'undefined') {
        console.log('QQ SDK已加载');
        return Promise.resolve();
      }

      return new Promise((resolve, reject) => {
        // 创建QQ登录SDK脚本
        const script = document.createElement('script');
        script.src = 'https://connect.qq.com/qc_jssdk.js';
        script.setAttribute('data-appid', this.config.QQ_APP_ID);
        script.setAttribute('data-redirecturi', this.config.QQ_REDIRECT_URI);
        script.async = true;

        script.onload = () => {
          console.log('QQ SDK加载成功');
          resolve();
        };

        script.onerror = () => {
          console.error('QQ SDK加载失败');
          reject(new Error('QQ SDK加载失败'));
        };

        document.head.appendChild(script);
      });
    },

    // 执行QQ登录
    performQQLogin() {
      // 检查是否移动设备
      const isMobileDevice = navigator.userAgent.match(
          /(iPhone|iPod|Android|ios|iOS|iPad|Backerry|WebOS|Symbian|Windows Phone|Phone)/i
      );

      try {
        // 确保QC对象存在
        if (typeof QC !== 'undefined' && QC.Login) {
          if (isMobileDevice && QC.Login.showPopup) {
            // 移动设备使用弹窗
            QC.Login.showPopup({
              appId: this.config.QQ_APP_ID,
              redirectURI: this.config.QQ_REDIRECT_URI
            });
          } else {
            // PC设备，检查是否已经登录
            if (QC.Login.check()) {
              // 已登录，获取用户信息
              QC.Login.getMe(openId => {
                this.$toast({ type: "success", message: "QQ登录成功，正在获取用户信息..." });

                // 重定向到处理页面
                window.location.href = this.config.QQ_REDIRECT_URI;
              });
            } else {
              // 未登录，使用标准登录
              QC.Login.signIn();
            }
          }
        } else {
          // QC对象不完整，使用备用方式
          this.qqLoginFallback();
        }
      } catch (error) {
        console.error('QQ登录执行出错', error);
        this.$toast({ type: "error", message: "QQ登录初始化失败，使用备用登录方式" });
        this.qqLoginFallback();
      }
    },

    // QQ登录备用方式
    qqLoginFallback() {
      // 检查是否移动设备
      const isMobileDevice = navigator.userAgent.match(
          /(iPhone|iPod|Android|ios|iOS|iPad|Backerry|WebOS|Symbian|Windows Phone|Phone)/i
      );

      const display = isMobileDevice ? 'mobile' : 'pc';

      this.$toast({ type: "info", message: "正在跳转到QQ登录页面..." });

      // 使用URL直接跳转方式
      window.open(
          "https://graph.qq.com/oauth2.0/authorize?client_id=" +
          this.config.QQ_APP_ID +
          "&response_type=code" +
          "&redirect_uri=" + encodeURIComponent(this.config.QQ_REDIRECT_URI) +
          "&state=STATE" +
          "&scope=get_user_info" +
          "&display=" + display,
          "_self"
      );
    }
  },
  watch: {
    loginType() {
      this.handleLoginTypeChange();
    }
  },
  mounted() {
    this.log('登录组件已挂载');

    // 初始化配置
    if (!this.config) {
      this.config = {
        // 请填写您的腾讯验证码应用ID
        TENCENT_CAPTCHA: 'Your_TENCENT_CAPTCHA_ID',
        // 请填写您的QQ互联应用ID
        QQ_APP_ID: 'Your_QQ_APP_ID',
        // 请填写您的QQ登录回调地址
        QQ_REDIRECT_URI: 'Your_QQ_REDIRECT_URI',
        // 请填写您的微信应用ID
        WECHAT_APP_ID: 'Your_WECHAT_APP_ID',
        // 请填写您的微信登录回调地址
        WECHAT_REDIRECT_URI: 'Your_WECHAT_REDIRECT_URI'
      };
      this.log('初始化配置完成', this.config);
    } else {
      this.log('已有配置', this.config);
    }

    // 检查TencentCaptcha是否可用
    if (typeof TencentCaptcha === 'undefined') {
      this.log('警告: TencentCaptcha 未加载');

    } else {
      this.log('TencentCaptcha 已加载');
    }

    // 添加QQ登录SDK动态加载
    this.loadQQSDK();
  }
};
</script>

<style scoped>
.login-container {
  display: flex;
  min-height: 680px;
  overflow: hidden;
  border-radius: 8px;
}

.close-btn {
  position: absolute;
  top: 16px;
  right: 16px;
  z-index: 1;
  cursor: pointer;
}

.login-banner {
  flex: 1;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  padding: 40px;
  text-align: center;
}

.banner-content h2 {
  font-size: 2.5em;
  margin-bottom: 16px;
}

.banner-content p {
  font-size: 1.2em;
  opacity: 0.9;
}

.login-content {
  flex: 1;
  padding: 40px;
  display: flex;
  flex-direction: column;
}

.login-title {
  font-size: 28px;
  font-weight: bold;
  color: #333;
}

.login-forms {
  min-height: 180px;
  margin-top: 10px;
}

.forget-password {
  text-align: right;
  margin: 8px 0 16px;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.custom-code-row {
  display: flex;
  width: 100%;
  height: 45px;
  margin-bottom: 16px;
}

.custom-input-wrapper {
  flex: 1;
  margin-right: 10px;
}

.custom-input-field {
  position: relative;
  border: 1px solid rgba(0, 0, 0, 0.23);
  border-radius: 4px;
  min-height: 40px;
  display: flex;
  background-color: white;
  transition: border-color 0.2s;
}

.custom-input-field.focus-within {
  border: 1px solid var(--v-primary-base, #1976d2);
  border-width: 2px;
}

.custom-prepend-icon {
  display: flex;
  align-items: center;
  padding: 0 12px;
  color: rgba(0, 0, 0, 0.54);
}

.custom-prepend-icon i {
  font-size: 20px;
}

.custom-input-container {
  position: relative;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 48px;
}

.custom-label {
  position: absolute;
  font-size: 16px;
  color: rgba(0, 0, 0, 0.6);
  pointer-events: none;
  transition: all 0.3s ease;
  transform-origin: left top;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
}

.custom-label.float-label {
  top: -6px;
  font-size: 12px;
  color: var(--v-primary-base, #1976d2);
  background-color: white;
  padding: 0 4px;
  margin-left: -4px;
}

.custom-input {
  border: none;
  outline: none;
  background: transparent;
  font-size: 16px;
  color: rgba(0, 0, 0, 0.87);
  padding: 0;
  width: 100%;
  height: 100%;
}

.custom-input-field.focus-within .custom-prepend-icon {
  color: var(--v-primary-base, #1976d2);
}

.custom-button {
  width: 80px;
  height: 48px;
  border: 1px solid var(--v-primary-base, #1976d2);
  color: var(--v-primary-base, #1976d2);
  background-color: transparent;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s;
  padding: 0;
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  text-transform: none;
}

.custom-button:hover:not(:disabled) {
  background-color: rgba(25, 118, 210, 0.05);
}

.custom-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.login-btn {
  margin: 16px 0 24px;
  font-size: 16px;
  letter-spacing: 1px;
}

/* 改进的社交登录和注册提示区域样式 */
.social-section {
  margin-top: 0px;
}

.divider-text {
  text-align: center;
  position: relative;
  margin-bottom: 5px;
  color: #909399;
  font-size: 14px;
}

.divider-text::before,
.divider-text::after {
  content: '';
  position: absolute;
  top: 50%;
  width: 30%;
  height: 1px;
  background-color: #e0e0e0;
}

.divider-text::before {
  left: 0;
}

.divider-text::after {
  right: 0;
}

.divider-text span {
  background-color: #fff;
  padding: 0 0px;
  position: relative;
  z-index: 1;
}

.social-icon-group {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 30px;
}

.social-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 45px;
  height: 45px;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;
}

.social-icon.wechat {
  color: #2aae67;
  border: 1px solid rgba(42, 174, 103, 0.2);
  background-color: rgba(42, 174, 103, 0.05);
}

.social-icon.weibo {
  color: #e05244;
  border: 1px solid rgba(224, 82, 68, 0.2);
  background-color: rgba(224, 82, 68, 0.05);
}

.social-icon.qq {
  color: #00AAEE;
  border: 1px solid rgba(0, 170, 238, 0.2);
  background-color: rgba(0, 170, 238, 0.05);
}

.social-icon:hover {
  transform: translateY(-3px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.signup-prompt {
  text-align: center;
  padding: 0px;
  border-top: 0px solid #f0f0f0;
  margin-top: 8px;
  color: #606266;
}

.signup-link {
  color: var(--v-primary-base, #1976d2);
  margin-left: 0px;
  font-weight: 500;
  cursor: pointer;
  text-decoration: none;
}

.signup-link:hover {
  text-decoration: underline;
}

/* 移动端适配 */
@media (max-width: 600px) {
  .divider-text::before,
  .divider-text::after {
    width: 25%;
  }

  .social-icon-group {
    gap: 20px;
  }

  .social-icon {
    width: 40px;
    height: 40px;
  }
}

/* 调整输入框样式 */
:deep(.v-text-field.v-text-field--enclosed.v-input--dense .v-text-field__details) {
  display: none;
}

:deep(.v-text-field.v-text-field--outlined fieldset) {
  border-color: rgba(0, 0, 0, 0.23);
}

:deep(.v-text-field.v-text-field--outlined:hover fieldset) {
  border-color: rgba(0, 0, 0, 0.87);
}

:deep(.v-text-field.v-text-field--outlined.v-input--is-focused fieldset) {
  border-color: var(--v-primary-base, #1976d2);
  border-width: 2px;
}

:deep(.v-input__slot) {
  min-height: 56px !important;
}

:deep(.v-label) {
  font-size: 16px !important;
  top: 18px !important;
}

:deep(.v-label--active) {
  transform: translateY(-22px) scale(0.75) !important;
}

:deep(.v-input__prepend-inner) {
  margin-top: 16px !important;
}

:deep(.v-input__append-inner) {
  margin-top: 16px !important;
}

:deep(.v-label) {
  top: 12px !important;
}

:deep(.v-text-field--outlined.v-input--dense input) {
  margin-top: 0 !important;
}

.verify-btn {
  margin-top: 4px !important;
}

.v-card-text {
  padding: 0 16px !important;
}

:deep(.v-text-field__slot),
:deep(.v-label),
:deep(.v-input__prepend-inner),
:deep(.v-input__append-inner) {
  display: flex !important;
  align-items: center !important;
  height: 40px !important;
}

:deep(.v-text-field__details) {
  display: block !important;
  padding-top: 4px;
  min-height: 20px;
  margin-bottom: 8px;
}

:deep(.v-messages) {
  min-height: 20px;
  font-size: 12px;
  color: #ff5252 !important;
  opacity: 1 !important;
}

:deep(.v-messages__message) {
  line-height: 1.2;
  color: #ff5252 !important;
  opacity: 1 !important;
  display: block !important;
}

:deep(.v-text-field--error) {
  margin-bottom: 24px !important;
}

:deep(.v-input__slot) {
  margin-bottom: 0 !important;
}

:deep(.v-text-field__details) {
  opacity: 1 !important;
  display: block !important;
  height: auto !important;
  min-height: 20px !important;
}

/* 输入框错误状态样式 */
:deep(.v-input--error) {
  color: #ff5252 !important;
}

:deep(.v-input--error .v-input__slot) {
  border-color: #ff5252 !important;
}

.v-text-field {
  margin-bottom: 16px !important;
}

.validation-rules {
  font-size: 12px;
  color: rgba(0, 0, 0, 0.6);
  margin-top: 4px;
}

/* 深色模式样式 */
.theme--dark .login-container,
[data-theme='dark'] .login-container,
body.theme-dark .login-container {
  background-color: #1e1e1e !important;
  color: #ffffff !important;
}

.theme--dark .login-content,
[data-theme='dark'] .login-content,
body.theme-dark .login-content {
  background-color: #1e1e1e !important;
  color: #ffffff !important;
}

.theme--dark .login-title,
[data-theme='dark'] .login-title,
body.theme-dark .login-title {
  color: #ffffff !important;
}

.theme--dark .divider-text span,
[data-theme='dark'] .divider-text span,
body.theme-dark .divider-text span {
  background-color: #1e1e1e !important;
  color: #aaa !important;
}

.theme--dark .divider-text::before,
.theme--dark .divider-text::after,
[data-theme='dark'] .divider-text::before,
[data-theme='dark'] .divider-text::after,
body.theme-dark .divider-text::before,
body.theme-dark .divider-text::after {
  background-color: #444 !important;
}

.theme--dark .signup-prompt,
[data-theme='dark'] .signup-prompt,
body.theme-dark .signup-prompt {
  color: #cccccc !important;
}

/* 针对输入框的深色模式样式 */
.theme--dark .v-text-field,
[data-theme='dark'] .v-text-field,
body.theme-dark .v-text-field {
  color: #ffffff !important;
}

.theme--dark .v-text-field >>> .v-label,
[data-theme='dark'] .v-text-field >>> .v-label,
body.theme-dark .v-text-field >>> .v-label {
  color: rgba(255, 255, 255, 0.7) !important;
}

.theme--dark .v-text-field >>> input,
[data-theme='dark'] .v-text-field >>> input,
body.theme-dark .v-text-field >>> input {
  color: #ffffff !important;
}

/* 覆盖Vuetify的对话框背景 */
.theme--dark.v-application .v-dialog,
[data-theme='dark'] .v-application .v-dialog,
body.theme-dark .v-application .v-dialog {
  background-color: transparent !important;
  box-shadow: none !important;
}

/* 强制对话框内容区域透明 */
.theme--dark.v-application .v-dialog__content,
[data-theme='dark'] .v-application .v-dialog__content,
body.theme-dark .v-application .v-dialog__content {
  background-color: transparent !important;
}

/* 对遮罩层的处理 */
.theme--dark.v-application .v-overlay__scrim,
[data-theme='dark'] .v-application .v-overlay__scrim,
body.theme-dark .v-application .v-overlay__scrim {
  background-color: rgba(0, 0, 0, 0.7) !important;
}

/* 全局覆盖对话框容器 */
:deep(.v-dialog) {
  background-color: transparent !important;
  box-shadow: none !important;
}

:deep(.v-dialog__content) {
  background-color: transparent !important;
}

/* 确保登录框中的社交图标在深色模式下保持原有颜色 */
.theme--dark .social-icon.wechat,
[data-theme='dark'] .social-icon.wechat,
body.theme-dark .social-icon.wechat {
  color: #2aae67 !important;
  background-color: rgba(42, 174, 103, 0.1) !important;
}

.theme--dark .social-icon.weibo,
[data-theme='dark'] .social-icon.weibo,
body.theme-dark .social-icon.weibo {
  color: #e05244 !important;
  background-color: rgba(224, 82, 68, 0.1) !important;
}

.theme--dark .social-icon.qq,
[data-theme='dark'] .social-icon.qq,
body.theme-dark .social-icon.qq {
  color: #00AAEE !important;
  background-color: rgba(0, 170, 238, 0.1) !important;
}
</style>
