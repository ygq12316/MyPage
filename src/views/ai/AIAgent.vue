<template>
  <div class="ai-agent-container">
    <div class="ai-banner">
      <v-card class="ai-agent-card">
        <v-card-title class="ai-title">
          <v-icon large color="primary" class="mr-2">mdi-robot</v-icon>
          Allure 智能助手
        </v-card-title>
        
        <v-card-subtitle class="ai-subtitle">
          我是您的智能助手，可以回答问题、提供帮助或进行日常对话
        </v-card-subtitle>
        
        <v-divider></v-divider>
        
        <div class="chat-container" ref="chatContainer">
          <div class="messages-container">
            <template v-for="(message, index) in messages">
              <div :key="index" :class="['message-item', message.sender === 'user' ? 'user-message' : 'agent-message']">
                <div class="message-avatar">
                  <v-avatar size="40">
                    <img v-if="message.sender === 'user'" :src="userAvatar || 'https://big-event20040810.oss-cn-beijing.aliyuncs.com/avatar/default.png'" alt="用户头像">
                    <v-icon v-else color="primary" size="40">mdi-robot</v-icon>
                  </v-avatar>
                </div>
                <div class="message-content">
                  <div class="message-text" v-html="formatMessage(message.content)"></div>
                  <div class="message-time">{{ formatTime(message.time) }}</div>
                </div>
              </div>
            </template>
            
            <div v-if="loading" class="agent-typing">
              <div class="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        </div>
        
        <v-divider></v-divider>
        
        <div class="input-container">
          <v-textarea
            v-model="userInput"
            outlined
            hide-details
            rows="2"
            auto-grow
            placeholder="请输入您的问题..."
            class="message-input"
            @keydown.enter.prevent="sendMessage"
          ></v-textarea>
          
          <v-btn
            color="primary"
            fab
            small
            class="send-button"
            :disabled="!userInput.trim() || loading"
            @click="sendMessage"
          >
            <v-icon>mdi-send</v-icon>
          </v-btn>
        </div>
        
        <div class="ai-features">
          <v-chip-group>
            <v-chip
              v-for="(suggestion, i) in suggestions"
              :key="i"
              outlined
              color="primary"
              @click="selectSuggestion(suggestion)"
              class="suggestion-chip"
            >
              {{ suggestion }}
            </v-chip>
          </v-chip-group>
        </div>
      </v-card>
    </div>
  </div>
</template>

<script>
import { marked } from 'marked';
import DOMPurify from 'dompurify';

export default {
  name: 'AIAgent',
  data: () => ({
    userInput: '',
    messages: [],
    loading: false,
    suggestions: [
      '网站有哪些功能？',
      '如何联系博主？',
      '怎么修改个人资料？',
      '忘记密码怎么办？'
    ]
  }),
  computed: {
    userAvatar() {
      return this.$store.state.avatar;
    }
  },
  mounted() {
    this.addAgentMessage('您好！我是Allure的智能助手，有什么我可以帮助您的吗？');
  },
  methods: {
    sendMessage() {
      if (!this.userInput.trim() || this.loading) return;
      
      // 添加用户消息
      this.addUserMessage(this.userInput);
      
      const query = this.userInput.trim();
      this.userInput = '';
      
      // 模拟加载状态
      this.loading = true;
      
      // 这里应该调用实际的AI API
      // 目前使用模拟响应
      setTimeout(() => {
        this.handleAgentResponse(query);
        this.loading = false;
        this.$nextTick(() => {
          this.scrollToBottom();
        });
      }, 1000);
    },
    
    handleAgentResponse(query) {
      // 这里是模拟的智能体响应逻辑
      // 实际项目中应该调用后端API
      let response = '';
      
      if (query.includes('功能')) {
        response = '本网站主要功能包括：\n\n• 文章阅读\n• 分类与标签管理\n• 评论与互动\n• 个人中心';
      } else if (query.includes('联系') || query.includes('骚扰') || query.includes('找博主') || query.includes('微信') || query.includes('QQ') || query.includes('二维码')) {
        response = `您可以通过以下方式联系博主：\n\n• QQ：2483433033\n• 邮箱：2483433033@qq.com\n\n**扫描二维码添加好友：**\n\n<div class="qrcode-grid">
          <div class="qrcode-item">
            <img src="${require('@/assets/img/wechat.png')}" alt="微信二维码" class="contact-qrcode"/>
            <div class="qrcode-label">微信</div>
          </div>
          <div class="qrcode-item">
            <img src="${require('@/assets/img/alipay.png')}" alt="QQ二维码" class="contact-qrcode"/>
            <div class="qrcode-label">QQ</div>
          </div>
        </div>\n\n博主很乐意收到您的留言和建议！`;
      } else if (query.includes('个人资料') || query.includes('修改资料')) {
        response = '修改个人资料：\n\n1. 登录您的账号\n2. 点击右上角头像\n3. 选择"个人中心"\n4. 在个人信息页面可以修改您的资料';
      } else if (query.includes('忘记密码')) {
        response = '如果忘记密码，可以：\n\n1. 点击登录页面的"忘记密码"\n2. 输入您的注册邮箱或者手机号\n3. 获取验证码\n4. 设置新密码';
      } else {
        response = '感谢您的提问！我是Allure的智能助手，目前仍在学习中。您可以询问关于网站功能、联系博主、账户管理等方面的问题，我会尽力提供帮助。';
      }
      
      this.addAgentMessage(response);
    },
    
    addUserMessage(content) {
      this.messages.push({
        sender: 'user',
        content,
        time: new Date()
      });
      this.$nextTick(() => {
        this.scrollToBottom();
      });
    },
    
    addAgentMessage(content) {
      this.messages.push({
        sender: 'agent',
        content,
        time: new Date()
      });
      this.$nextTick(() => {
        this.scrollToBottom();
      });
    },
    
    formatMessage(text) {
      // 处理特殊情况：列表项
      if (text.includes('- ')) {
        // 手动转换无序列表格式，避免Markdown重复符号
        const lines = text.split('\n');
        const formattedLines = lines.map(line => {
          if (line.trim().startsWith('- ')) {
            return line.replace('- ', '• '); // 替换为单个圆点
          }
          return line;
        });
        text = formattedLines.join('\n');
      }
      
      // 常规Markdown处理
      const html = marked.parse(text);
      return DOMPurify.sanitize(html);
    },
    
    formatTime(date) {
      return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    },
    
    scrollToBottom() {
      const container = this.$refs.chatContainer;
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    },
    
    selectSuggestion(suggestion) {
      this.userInput = suggestion;
      this.sendMessage();
    }
  }
}
</script>

<style scoped>
.ai-agent-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0;
  height: 100%;
}

.ai-banner {
  position: absolute;
  top: -60px;
  left: 0;
  right: 0;
  height: 100vh;
  background-color: #49b1f5;
  background-image: url("@/assets/img/6.jpg");
  background-position: center center;
  background-size: cover;
  background-repeat: no-repeat;
  animation: header-effect 1s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.ai-agent-card {
  width: 100%;
  max-width: 1000px;
  margin: 60px 20px 0;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25);
  background-color: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(10px);
  height: calc(100vh - 80px);
  display: flex;
  flex-direction: column;
  border: 1px solid rgba(255, 255, 255, 0.5);
}

.ai-title {
  font-size: 1.7rem;
  font-weight: 600;
  padding: 25px 30px 15px;
  color: #333;
  display: flex;
  align-items: center;
}

.ai-title .v-icon {
  font-size: 28px;
  margin-right: 12px;
}

.ai-subtitle {
  padding: 0 30px 20px;
  opacity: 0.7;
  font-size: 1rem;
  color: #555;
}

.chat-container {
  flex: 1;
  overflow-y: auto;
  padding: 30px;
  background-color: rgba(255, 255, 255, 0.4);
  border-top: 1px solid rgba(0, 0, 0, 0.05);
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  position: relative;
}

.messages-container {
  display: flex;
  flex-direction: column;
}

.message-item {
  display: flex;
  margin-bottom: 24px;
  max-width: 75%;
  animation: fade-in 0.3s ease-out;
}

.user-message {
  align-self: flex-end;
  flex-direction: row-reverse;
}

.agent-message {
  align-self: flex-start;
}

.message-avatar {
  margin: 0 12px;
}

.message-content {
  background-color: #fff;
  padding: 15px 20px;
  border-radius: 18px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.08);
  transition: transform 0.2s;
}

.user-message .message-content {
  background-color: #1976d2;
  color: white;
  border-top-right-radius: 4px;
}

.agent-message .message-content {
  border-top-left-radius: 15px;
}

.message-text {
  line-height: 1.6;
  word-break: break-word;
  font-size: 14px;
}

.message-text p {
  margin-bottom: 10px;
}

.message-text p:last-child {
  margin-bottom: 0;
}

.message-time {
  font-size: 0.7rem;
  color: #aaa;
  margin-top: 6px;
  text-align: right;
}

.user-message .message-time {
  color: rgba(255, 255, 255, 0.7);
}

.input-container {
  padding: 20px 30px 15px;
  display: flex;
  align-items: flex-end;
  background-color: rgba(255, 255, 255, 0.7);
}

.message-input {
  flex-grow: 1;
  border-radius: 15px;
}

.message-input >>> .v-text-field__slot textarea {
  font-size: 15px;
}

.send-button {
  margin-left: 15px;
  margin-bottom: 5px;
  transition: transform 0.2s;
}

.send-button:hover {
  transform: scale(1.1);
}

.ai-features {
  padding: 15px 30px 20px;
  background-color: rgba(255, 255, 255, 0.7);
}

.suggestion-chip {
  margin: 5px;
  font-size: 14px;
  height: 36px;
  transition: all 0.2s;
}

.suggestion-chip:hover {
  transform: translateY(-2px);
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.1);
}

.agent-typing {
  align-self: flex-start;
  margin-bottom: 20px;
  margin-left: 60px;
}

.typing-indicator {
  background-color: #f5f5f5;
  padding: 12px 16px;
  border-radius: 18px;
  display: flex;
  align-items: center;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.05);
}

.typing-indicator span {
  height: 8px;
  width: 8px;
  border-radius: 50%;
  background-color: #999;
  display: inline-block;
  margin-right: 5px;
  animation: bounce 1.5s infinite;
}

.typing-indicator span:nth-child(2) {
  animation-delay: 0.2s;
}

.typing-indicator span:nth-child(3) {
  animation-delay: 0.4s;
  margin-right: 0;
}

@keyframes bounce {
  0%, 60%, 100% {
    transform: translateY(0);
  }
  30% {
    transform: translateY(-4px);
  }
}

@keyframes header-effect {
  0% {
    opacity: 0;
    transform: translateY(-50px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fade-in {
  0% {
    opacity: 0;
    transform: translateY(10px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 自定义滚动条样式 */
.chat-container::-webkit-scrollbar {
  width: 8px;
}

.chat-container::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.05);
  border-radius: 4px;
}

.chat-container::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 4px;
}

.chat-container::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.3);
}

@media (max-width: 960px) {
  .ai-agent-card {
    max-width: 95%;
    height: calc(100vh - 70px);
  }
  
  .message-item {
    max-width: 85%;
  }
  
  .ai-title {
    font-size: 1.5rem;
    padding: 20px 20px 10px;
  }
  
  .ai-subtitle {
    padding: 0 20px 15px;
  }
  
  .chat-container {
    padding: 20px;
  }
  
  .input-container, .ai-features {
    padding: 15px 20px;
  }
}

@media (max-width: 600px) {
  .ai-agent-card {
    max-width: 100%;
    border-radius: 0;
    margin: 60px 0 0;
    height: calc(100vh - 60px);
  }
  
  .message-item {
    max-width: 90%;
  }
  
  .chat-container {
    padding: 15px;
  }
}

/* 自定义列表样式 */
:deep(.custom-list-item) {
  list-style-type: none;
  position: relative;
  padding-left: 0;
  margin-left: 0;
}

:deep(.custom-list-item::before) {
  content: "•"; /* 使用Unicode黑点 */
  position: absolute;
  left: -18px;
  color: inherit;
}

:deep(ul) {
  list-style-type: none;
  padding-left: 5px;
  margin: 10px 0;
}

:deep(li) {
  margin: 5px 0;
}

:deep(ul li::before) {
  content: none; /* 移除默认的项目符号 */
}

/* 二维码样式 */
:deep(.contact-qrcode) {
  width: 150px;
  height: 150px;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  margin: 5px 0;
  object-fit: cover;
}

:deep(.qrcode-grid) {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  margin: 15px 0;
}

:deep(.qrcode-item) {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 10px;
}

:deep(.qrcode-label) {
  margin-top: 8px;
  font-weight: bold;
  color: #1976d2;
}

/* 添加深色模式样式 */
.theme--dark .ai-agent-card,
body.theme-dark .ai-agent-card,
[data-theme='dark'] .ai-agent-card {
  background-color: rgba(30, 30, 30, 0.9);
  border-color: rgba(255, 255, 255, 0.1);
}

.theme--dark .ai-title,
body.theme-dark .ai-title,
[data-theme='dark'] .ai-title {
  color: #ffffff;
}

.theme--dark .ai-subtitle,
body.theme-dark .ai-subtitle,
[data-theme='dark'] .ai-subtitle {
  color: #ffffff;
  opacity: 0.8;
}

.theme--dark .chat-container,
body.theme-dark .chat-container,
[data-theme='dark'] .chat-container {
  background-color: rgba(30, 30, 30, 0.6);
  border-color: rgba(255, 255, 255, 0.05);
}

.theme--dark .agent-message .message-content,
body.theme-dark .agent-message .message-content,
[data-theme='dark'] .agent-message .message-content {
  background-color: #333333;
  color: #ffffff;
}

.theme--dark .message-text,
body.theme-dark .message-text,
[data-theme='dark'] .message-text {
  color: #ffffff;
}

.theme--dark .agent-message .message-time,
body.theme-dark .agent-message .message-time,
[data-theme='dark'] .agent-message .message-time {
  color: rgba(255, 255, 255, 0.6);
}

.theme--dark .input-container,
body.theme-dark .input-container,
[data-theme='dark'] .input-container,
.theme--dark .ai-features,
body.theme-dark .ai-features,
[data-theme='dark'] .ai-features {
  background-color: rgba(30, 30, 30, 0.7);
}

.theme--dark .typing-indicator,
body.theme-dark .typing-indicator,
[data-theme='dark'] .typing-indicator {
  background-color: #333333;
}

.theme--dark .typing-indicator span,
body.theme-dark .typing-indicator span,
[data-theme='dark'] .typing-indicator span {
  background-color: #ffffff;
}

/* 修复深色模式下的二维码标签颜色 */
.theme--dark :deep(.qrcode-label),
body.theme-dark :deep(.qrcode-label),
[data-theme='dark'] :deep(.qrcode-label) {
  color: #49b1f5;
}

/* 修复深色模式下的文本输入框颜色 */
.theme--dark .message-input >>> .v-text-field__slot textarea,
body.theme-dark .message-input >>> .v-text-field__slot textarea,
[data-theme='dark'] .message-input >>> .v-text-field__slot textarea {
  color: #ffffff;
}

/* 修复深色模式下的所有链接颜色 */
.theme--dark :deep(a),
body.theme-dark :deep(a),
[data-theme='dark'] :deep(a) {
  color: #49b1f5;
}
</style> 
