<template>
  <v-dialog 
    v-model="forgetFlag" 
    :fullscreen="isMobile" 
    max-width="520"
    content-class="dialog-transparent"
    overlay-opacity="0.7"
  >
    <v-card class="forget-container" elevation="3">
      <!-- 关闭按钮 -->
      <v-btn icon class="close-btn" @click="forgetFlag = false">
        <v-icon>mdi-close</v-icon>
      </v-btn>
      
      <!-- 标题区域 -->
      <div class="text-center mb-6">
        <h2 class="text-h4 font-weight-bold primary--text">找回密码</h2>
        <div class="step-progress mt-4">
          <div class="step-wrapper">
            <div class="step-item" :class="{ active: step === 1, completed: step > 1 }">
              <div class="step-number">1</div>
              <div class="step-label">选择找回方式</div>
            </div>
            <div class="progress-line" :class="{ completed: step > 1 }"></div>
            <div class="step-item" :class="{ active: step === 2 }">
              <div class="step-number">2</div>
              <div class="step-label">验证并重置</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 步骤内容 -->
      <v-window v-model="step">
        <!-- 步骤1：选择验证方式 -->
        <v-window-item :value="1">
          <div class="step-content">
            <div class="verify-method" @click="selectMethod('email')" :class="{ selected: method === 'email' }">
              <v-icon size="32" color="primary">mdi-email-outline</v-icon>
              <div class="method-text">
                <div class="method-title">邮箱验证</div>
                <div class="method-desc">通过邮箱接收验证码</div>
              </div>
            </div>
            <div class="verify-method" @click="selectMethod('phone')" :class="{ selected: method === 'phone' }">
              <v-icon size="32" color="primary">mdi-phone-outline</v-icon>
              <div class="method-text">
                <div class="method-title">手机验证</div>
                <div class="method-desc">通过手机接收验证码</div>
              </div>
            </div>
          </div>
        </v-window-item>

        <!-- 步骤2：验证并重置密码 -->
        <v-window-item :value="2">
          <div class="step-content">
            <div class="input-group">
              <!-- 账号输入 -->
              <v-text-field
                v-model="formData[method]"
                dense
                outlined
                :label="method === 'email' ? '邮箱地址' : '手机号码'"
                :placeholder="method === 'email' ? '请输入邮箱地址' : '请输入手机号码'"
                :prepend-inner-icon="method === 'email' ? 'mdi-email-outline' : 'mdi-phone-outline'"
                :rules="[rules.required, method === 'email' ? rules.email : rules.phone]"
              />

              <!-- 验证码 -->
              <div class="d-flex verify-code-wrapper">
                <v-text-field
                  v-model="formData.code"
                  dense
                  outlined
                  maxlength="6"
                  label="验证码"
                  placeholder="请输入验证码"
                  prepend-inner-icon="mdi-shield-check-outline"
                  class="flex-grow-1"
                />
                <v-btn 
                  :disabled="flag || counting"
                  color="primary" 
                  @click="sendCode"
                  min-width="120"
                  height="40"
                  class="ml-3"
                >
                  {{ codeMsg }}
                </v-btn>
              </div>

              <!-- 新密码 -->
              <v-text-field
                v-model="formData.password"
                dense
                outlined
                label="新密码"
                placeholder="请输入新密码"
                prepend-inner-icon="mdi-lock-outline"
                :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
                :type="show ? 'text' : 'password'"
                @click:append="show = !show"
                @blur="validatePassword"
                :error-messages="passwordError"
                class="mt-4"
              />

              <!-- 确认密码 -->
              <v-text-field
                v-model="formData.confirmPassword"
                dense
                outlined
                label="确认密码"
                placeholder="请再次输入新密码"
                prepend-inner-icon="mdi-lock-check-outline"
                :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
                :type="show ? 'text' : 'password'"
                @click:append="show = !show"
                @blur="validateConfirmPassword"
                :error-messages="confirmPasswordError"
              />
            </div>
          </div>
        </v-window-item>
      </v-window>

      <!-- 底部按钮 -->
      <div class="button-group">
        <v-btn
          v-if="step > 1"
          outlined
          color="primary"
          class="mr-3"
          @click="step--"
        >
          上一步
        </v-btn>
        <v-btn
          color="primary"
          :loading="loading || verifyLoading"
          @click="nextStep"
        >
          {{ step === 2 ? '完成' : '下一步' }}
        </v-btn>
      </div>

      <!-- 返回登录 -->
      <div class="text-center mt-6">
        <span class="grey--text">已有账号？</span>
        <a @click="openLogin" class="primary--text font-weight-medium">立即登录</a>
      </div>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  data: function() {
    return {
      step: 1,
      method: null,
      loading: false,
      verifyLoading: false,
      codeVerified: false,
      formData: {
        email: "",
        phone: "",
        code: "",
        password: "",
        confirmPassword: ""
      },
      counting: false,
      flag: false,
      codeMsg: "获取验证码",
      time: 60,
      show: false,
      rules: {
        required: v => !!v || "此项不能为空",
        email: v => /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(v) || "邮箱格式不正确",
        phone: v => /^1[3-9]\d{9}$/.test(v) || "手机号格式不正确",
        password: v => v.length >= 6 || "密码不能少于6位",
        confirmPassword: v => v === this.formData.password || "两次输入的密码不一致"
      },
      passwordError: "",
      confirmPasswordError: "",
      passwordTouched: false,
      confirmPasswordTouched: false,
    };
  },
  methods: {
    selectMethod(method) {
      this.method = method;
    },
    async nextStep() {
      if (this.step === 1) {
        if (!this.method) {
          this.$toast({ type: "error", message: "请选择验证方式" });
          return;
        }
        this.step++;
        return;
      }
      
      if (this.step === 2) {
        // 直接调用重置密码
        this.forget();
      }
    },
    openLogin() {
      this.$store.state.forgetFlag = false;
      this.$store.state.loginFlag = true;
    },
    sendCode() {
      // 重置验证码验证状态
      this.codeVerified = false;
      
      const username = this.method === 'email' ? this.formData.email : this.formData.phone;
      
      if (!username) {
        this.$toast({ type: "error", message: "请先输入" + (this.method === 'email' ? "邮箱" : "手机号") });
        return;
      }
      
      if (this.method === 'email' && !this.rules.email(username)) {
        this.$toast({ type: "error", message: "邮箱格式不正确" });
        return;
      }
      
      if (this.method === 'phone' && !this.rules.phone(username)) {
        this.$toast({ type: "error", message: "手机号格式不正确" });
        return;
      }

      const that = this;
      // 验证码校验
      var captcha = new TencentCaptcha(this.config.TENCENT_CAPTCHA, function(res) {
        if (res.ret === 0) {
          that.countDown();
          if (that.method === 'email') {
            that.axios.get("/api/users/code", {
              params: { username, type: 'email' }
            }).then(({ data }) => {
              if (data.flag) {
                that.$toast({ type: "success", message: data.message });
              } else {
                that.$toast({ type: "error", message: data.message });
              }
            });
          } else {
            that.axios.post("/api/users/sms/code", {
              username: username
            }).then(({ data }) => {
              if (data.flag) {
                that.$toast({ type: "success", message: data.message });
              } else {
                that.$toast({ type: "error", message: data.message });
              }
            });
          }
        }
      });
      captcha.show();
    },
    countDown() {
      this.counting = true;
      this.flag = true;
      this.timer = setInterval(() => {
        this.time--;
        this.codeMsg = this.time + "s";
        if (this.time <= 0) {
          clearInterval(this.timer);
          this.codeMsg = "获取验证码";
          this.time = 60;
          this.flag = false;
          this.counting = false;
        }
      }, 1000);
    },
    forget() {
      const username = this.formData[this.method];
      
      // 表单验证
      if (this.method === 'email' && !this.rules.email(username)) {
        this.$toast({ type: "error", message: "邮箱格式不正确" });
        return;
      }
      if (this.method === 'phone' && !this.rules.phone(username)) {
        this.$toast({ type: "error", message: "手机号格式不正确" });
        return;
      }
      if (this.formData.code.trim().length != 6) {
        this.$toast({ type: "error", message: "请输入6位验证码" });
        return;
      }

      // 密码验证
      this.passwordTouched = true;
      this.confirmPasswordTouched = true;
      
      if (!this.validatePassword()) {
        return;
      }
      if (!this.validateConfirmPassword()) {
        return;
      }

      const user = {
        username,
        password: this.formData.password,
        code: this.formData.code,
        type: this.method
      };

      this.loading = true;
      this.axios.put("/api/users/password", user).then(({ data }) => {
        if (data.flag) {
          this.$toast({ type: "success", message: data.message });
          this.forgetFlag = false;
        } else {
          this.$toast({ type: "error", message: data.message });
        }
      }).finally(() => {
        this.loading = false;
      });
    },
    handleCodeInput() {
      // 当验证码输入框值变化时，重置验证状态
      this.codeVerified = false;
    },
    validatePassword() {
      this.passwordTouched = true;
      if (!this.formData.password) {
        this.passwordError = "密码不能为空";
        return false;
      }
      if (this.formData.password.length < 6) {
        this.passwordError = "密码不能少于6位";
        return false;
      }
      this.passwordError = "";
      return true;
    },
    validateConfirmPassword() {
      this.confirmPasswordTouched = true;
      if (!this.formData.confirmPassword) {
        this.confirmPasswordError = "请确认密码";
        return false;
      }
      if (this.formData.confirmPassword !== this.formData.password) {
        this.confirmPasswordError = "两次输入的密码不一致";
        return false;
      }
      this.confirmPasswordError = "";
      return true;
    }
  },
  computed: {
    forgetFlag: {
      set(value) {
        this.$store.state.forgetFlag = value;
      },
      get() {
        return this.$store.state.forgetFlag;
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
    'formData.email'(value) {
      if (this.method === 'email') {
        this.flag = !this.rules.email(value);
      }
    },
    'formData.phone'(value) {
      if (this.method === 'phone') {
        this.flag = !this.rules.phone(value);
      }
    },
    method(value) {
      const input = value === 'email' ? this.formData.email : this.formData.phone;
      this.flag = value === 'email' ? 
        !this.rules.email(input) : 
        !this.rules.phone(input);
    },
    'formData.code'() {
      this.handleCodeInput();
    },
    'formData.password'(val) {
      if (this.passwordTouched) {
        this.validatePassword();
      }
      if (this.confirmPasswordTouched) {
        this.validateConfirmPassword();
      }
    },
    'formData.confirmPassword'(val) {
      if (this.confirmPasswordTouched) {
        this.validateConfirmPassword();
      }
    }
  },
  beforeDestroy() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }
};
</script>

<style scoped>
.forget-container {
  padding: 2rem;
  border-radius: 12px;
}

.step-progress {
  margin: 2rem 0;
}

.step-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  max-width: 600px;
  margin: 0 auto;
  position: relative;
}

.step-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  z-index: 2;
}

.step-number {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #E0E0E0;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  margin-bottom: 8px;
  transition: all 0.3s ease;
}

.step-label {
  font-size: 14px;
  color: #999;
  white-space: nowrap;
}

.progress-line {
  flex: 1;
  height: 2px;
  background: #E0E0E0;
  margin: 0 10px;
  position: relative;
  top: -10px;
  min-width: 80px;
  transition: all 0.3s ease;
}

.step-item.active .step-number {
  background: #1976D2;
  transform: scale(1.1);
}

.step-item.active .step-label {
  color: #1976D2;
  font-weight: 500;
}

.step-item.completed .step-number {
  background: #4CAF50;
}

.step-item.completed .step-label {
  color: #4CAF50;
}

.progress-line.completed {
  background: #4CAF50;
}

.step-content {
  padding: 1rem;
}

.verify-method {
  display: flex;
  align-items: center;
  padding: 1rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  margin-bottom: 1rem;
  cursor: pointer;
  transition: all 0.3s;
}

.verify-method:hover {
  border-color: var(--v-primary-base);
  background: #f5f5f5;
}

.verify-method.selected {
  border-color: var(--v-primary-base);
  background: var(--v-primary-lighten-5);
}

.method-text {
  margin-left: 1rem;
}

.method-title {
  font-weight: bold;
  margin-bottom: 4px;
}

.method-desc {
  font-size: 14px;
  color: #666;
}

.input-group {
  max-width: 400px;
  margin: 0 auto;
}

.verify-code-wrapper {
  margin-top: 1rem;
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.verify-code-wrapper .v-btn {
  margin-top: 0 !important;
  height: 40px !important;
}

.button-group {
  display: flex;
  justify-content: center;
  margin-top: 2rem;
}

@media (max-width: 600px) {
  .forget-container {
    padding: 1rem;
    height: 100%;
  }
  
  .step-wrapper {
    padding: 0 20px;
  }

  .progress-line {
    min-width: 40px;
  }

  .step-number {
    width: 28px;
    height: 28px;
    font-size: 14px;
  }

  .step-label {
    font-size: 12px;
  }
}

/* 确保对话框本身透明 */
.dialog-transparent {
  background-color: transparent !important;
}

/* 强化深色模式样式 */
.theme--dark .forget-container,
[data-theme='dark'] .forget-container,
body.theme-dark .forget-container {
  background-color: #1e1e1e !important;
  color: #ffffff !important;
}

.theme--dark .text-h4,
[data-theme='dark'] .text-h4,
body.theme-dark .text-h4 {
  color: #ffffff !important;
}

.theme--dark .primary--text,
[data-theme='dark'] .primary--text,
body.theme-dark .primary--text {
  color: #49b1f5 !important;
}

.theme--dark .step-label,
[data-theme='dark'] .step-label,
body.theme-dark .step-label {
  color: #aaaaaa !important;
}

.theme--dark .method-title,
[data-theme='dark'] .method-title,
body.theme-dark .method-title {
  color: #ffffff !important;
}

.theme--dark .method-desc,
[data-theme='dark'] .method-desc,
body.theme-dark .method-desc {
  color: #aaaaaa !important;
}

.theme--dark .verify-method,
[data-theme='dark'] .verify-method,
body.theme-dark .verify-method {
  border-color: #444444 !important;
}

.theme--dark .verify-method:hover,
[data-theme='dark'] .verify-method:hover,
body.theme-dark .verify-method:hover {
  background-color: #2c2c2c !important;
}

.theme--dark .verify-method.selected,
[data-theme='dark'] .verify-method.selected,
body.theme-dark .verify-method.selected {
  background-color: rgba(25, 118, 210, 0.2) !important;
}

.theme--dark .grey--text,
[data-theme='dark'] .grey--text,
body.theme-dark .grey--text {
  color: #aaaaaa !important;
}

/* 修复表单控件颜色 */
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

/* 步骤指示器深色模式 */
.theme--dark .step-number,
[data-theme='dark'] .step-number,
body.theme-dark .step-number {
  background-color: #444444 !important;
}

.theme--dark .progress-line,
[data-theme='dark'] .progress-line,
body.theme-dark .progress-line {
  background-color: #444444 !important;
}

.theme--dark .step-item.active .step-number,
[data-theme='dark'] .step-item.active .step-number,
body.theme-dark .step-item.active .step-number {
  background-color: #1976D2 !important;
}

.theme--dark .step-item.completed .step-number,
[data-theme='dark'] .step-item.completed .step-number,
body.theme-dark .step-item.completed .step-number {
  background-color: #4CAF50 !important;
}

.theme--dark .progress-line.completed,
[data-theme='dark'] .progress-line.completed,
body.theme-dark .progress-line.completed {
  background-color: #4CAF50 !important;
}

/* 全局覆盖对话框容器样式 */
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

/* 确保对话框内容透明 */
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
</style>
