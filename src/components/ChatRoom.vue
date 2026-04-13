<template>
  <div>
    <!-- 聊天界面 -->
    <div
      class="chat-container animated bounceInUp"
      v-show="isShow"
      @click="closeAll"
      @contextmenu.prevent.stop="closeAll"
    >
      <!-- 标题 -->
      <div class="header">
        <img width="32" height="32" src="../assets/img/bubble-chat.png" />
        <div style="margin-left:12px">
          <div>
            聊天室
            <small style="color:#ff4d4f;">({{ connectionStatus }})</small>
          </div>
          <div style="font-size:12px">当前{{ count }}人在线</div>
        </div>
        <v-icon class="close" @click="isShow = false">
          mdi-close
        </v-icon>
      </div>
      <!-- 对话内容 -->
      <div class="message" id="message">
        <!-- 当未连接时显示测试工具 -->
        <div v-if="connectionStatus !== '已连接'" class="connection-error">
          <p>聊天室未连接 ({{ connectionStatus }})</p>
          <div class="test-tools">
            <input
              v-model="testWsUrl"
              placeholder="WebSocket地址"
              class="test-input"
            />
            <button @click="testWebSocket" class="retry-btn">测试连接</button>
          </div>
          <p
            v-if="testResult"
            :class="{ 'test-success': testSuccess, 'test-error': !testSuccess }"
          >
            {{ testResult }}
          </p>
          <button @click="retryConnection" class="retry-btn">
            重试默认连接
          </button>
        </div>
        <!-- 录音遮罩层 -->
        <div
          v-show="voiceActive"
          class="voice"
          @mousemove.prevent.stop="translationmove($event)"
          @mouseup.prevent.stop="translationEnd($event)"
        >
          <v-icon ref="voiceClose" class="close-voice">mdi-close</v-icon>
        </div>
        <div
          :class="isMyMessage(item)"
          v-for="(item, index) of chatRecordList"
          :key="index"
        >
          <!-- 头像 -->
          <img :src="item.avatar" :class="isleft(item)" />
          <div>
            <!-- 对于他人消息显示昵称和时间 -->
            <div class="nickname" v-if="!isSelf(item)">
              {{ item.nickname }}
              <span style="margin-left:12px">{{ item.createTime | hour }}</span>
            </div>
            <!-- 对于自己的消息，可以将时间移到右侧显示 -->
            <div class="nickname text-right" v-if="isSelf(item)">
              <span>{{ item.createTime | hour }}</span>
            </div>
            <!-- 内容 -->
            <div
              ref="content"
              @contextmenu.prevent.stop="showBack(item, index, $event)"
              :class="isMyContent(item)"
            >
              <!-- 文字消息 -->
              <div v-if="item.type == 3" v-html="item.content" />
              <!-- 语音消息 -->
              <div v-if="item.type == 5" @click.prevent.stop="playVoice(item)">
                <audio
                  @ended="endVoice(item)"
                  @canplay="getVoiceTime(item)"
                  ref="voices"
                  :src="item.content"
                  style="display:none"
                />
                <!-- 播放 -->
                <v-icon
                  :color="isSelf(item) ? '#fff' : '#000'"
                  ref="plays"
                  style="display:inline-flex;cursor: pointer;"
                >
                  mdi-arrow-right-drop-circle
                </v-icon>
                <!-- 暂停 -->
                <v-icon
                  :color="isSelf(item) ? '#fff' : '#000'"
                  ref="pauses"
                  style="display:none;cursor: pointer;"
                >
                  mdi-pause-circle
                </v-icon>
                <!-- 音频时长 -->
                <span ref="voiceTimes" />
              </div>
              <div class="back-menu" ref="backBtn" @click="back(item, index)">
                撤回
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 输入框 -->
      <div class="footer">
        <!-- 表情框 -->
        <div class="emoji-box" v-show="isEmoji">
          <Emoji :chooseEmoji="true" @addEmoji="addEmoji" />
        </div>
        <div class="emoji-border" v-show="isEmoji" />
        <!-- 切换输入方式 -->
        <v-icon
          v-show="!isVoice"
          @click="isVoice = !isVoice"
          style="margin-right: 8px"
        >
          mdi-microphone
        </v-icon>
        <v-icon
          v-show="isVoice"
          @click="isVoice = !isVoice"
          style="margin-right: 8px"
        >
          mdi-keyboard
        </v-icon>
        <!-- 文字输入 -->
        <textarea
          v-show="!isVoice"
          ref="chatInput"
          v-model="content"
          @keydown.enter.prevent="handleEnterKey"
          placeholder="请输入内容"
        />
        <!-- 语音输入 -->
        <button
          class="voice-btn"
          v-show="isVoice"
          @mousedown.prevent.stop="translationStart"
          @mouseup.prevent.stop="translationEnd($event)"
          @touchstart.prevent.stop="translationStart"
          @touchend.prevent.stop="translationEnd($event)"
          @touchmove.prevent.stop="translationmove($event)"
        >
          按住说话
        </button>
        <!-- 表情 -->
        <i
          class="iconfont iconbiaoqing emoji"
          :style="isEmoji ? 'color:#FFC83D' : ''"
          @click.prevent.stop="openEmoji"
        />
        <!-- 发送按钮 -->
        <i :class="isInput" @click="saveMessage" style="font-size: 1.5rem" />
      </div>
    </div>
    <!-- 未读数量 -->
    <div class="chat-btn" v-if="chatEnabled" @click="open">
      <span class="unread" v-if="unreadCount > 0">{{ unreadCount }}</span>
      <img width="80%" height="80%" src="../assets/img/bubble-chat.png" />
    </div>
  </div>
</template>

<script>
import Recorderx, { ENCODE_TYPE } from "recorderx";
import Emoji from "./Emoji";
import EmojiList from "../assets/js/emoji";
export default {
  components: {
    Emoji
  },
  updated() {
    var ele = document.getElementById("message");
    ele.scrollTop = ele.scrollHeight;
  },
  beforeDestroy() {
    clearInterval(this.heartBeat);
    if (this.pollInterval) {
      clearInterval(this.pollInterval);
    }
  },
  data: function() {
    return {
      isEmoji: false,
      isShow: false,
      websocket: null,
      content: "",
      chatRecordList: [],
      voiceList: [],
      rc: null,
      ipAddr: "",
      ipSource: "",
      count: 0,
      unreadCount: 0,
      isVoice: false,
      voiceActive: false,
      startVoiceTime: null,
      WebsocketMessage: {
        type: null,
        data: null
      },
      heartBeat: null,
      connectionStatus: "未连接",
      maxRetries: 3,
      retryCount: 0,
      retryInterval: 3000, // 3秒后重试
      isSending: false,
      currentUrl: "",
      wsUrl: "",
      diagnosticsInfo: {},
      isMobileDevice: false,
      fallbackMode: false,
      pollInterval: null,
      lastMessageId: 0,
      testWsUrl: "ws://127.0.0.1:8080/websocket",
      testResult: "",
      testSuccess: false,
      chatEnabled: false
    };
  },
  methods: {
    open() {
      if (!this.chatEnabled) {
        this.connectionStatus = "已关闭";
        this.$toast({ type: "warning", message: "聊天室功能已关闭" });
        return;
      }
      
      if (this.isMobileDevice && !this.websocket) {
        
        this.connect();
      } else if (!this.checkConnection()) {
        
        this.connect();
      }
      this.unreadCount = 0;
      this.isShow = !this.isShow;
    },
    openEmoji() {
      this.isEmoji = !this.isEmoji;
      this.isVoice = false;
    },
    connect() {
      if (!this.chatEnabled) {
        this.connectionStatus = "已关闭";
        return;
      }
      // 清除之前的连接
      if (this.websocket) {
        this.websocket.close();
        this.websocket = null;
      }
      if (this.heartBeat) {
        clearInterval(this.heartBeat);
      }

      this.connectionStatus = "连接中...";
      
      // 获取基本信息
      const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
      const hostname = window.location.hostname;
      const port = window.location.port;

      // 定义可能的WebSocket地址 - 根据是否是HTTPS调整策略
      let possibleUrls = [];
      
      if (window.location.protocol === "https:") {
        // HTTPS环境下的连接选项 - 优先尝试标准SSL端口
        possibleUrls = [
          `${protocol}//${hostname}/websocket`, // 标准路径(使用当前网站端口)
          `${protocol}//${hostname}:443/websocket`, // 显式指定SSL标准端口
          `${protocol}//${hostname}/ws`, // 备选路径
          `${protocol}//${hostname}/chat`, // 另一个备选路径
        ];
        
        // 如果当前页面有自定义端口，也添加该端口的选项
        if (port && port !== "443") {
          possibleUrls.push(`${protocol}//${hostname}:${port}/websocket`);
        }
      } else {
        // HTTP环境下的连接选项
        possibleUrls = [
          `${protocol}//${hostname}/websocket`, // 标准路径
          `${protocol}//${hostname}/ws`, // 备选路径1
          `${protocol}//${hostname}/socket`, // 备选路径2
          `${protocol}//${hostname}:8080/websocket`, // 带端口的路径
        ];
        
        if (port && port !== "80") {
          possibleUrls.push(`${protocol}//${hostname}:${port}/websocket`);
        }
      }
      
      // 尝试第一个地址
      this.tryWebSocketConnection(possibleUrls, 0);
    },
    // 尝试连接WebSocket地址
    tryWebSocketConnection(addresses, index) {
      if (index >= addresses.length) {
        this.connectionStatus = "所有连接尝试失败";
        
        // 显示更详细的错误信息
        this.diagnosticsInfo = {
          protocol: window.location.protocol,
          isSecure: window.location.protocol === "https:",
          triedUrls: addresses,
          error: "无法建立WebSocket连接，请检查服务器配置是否支持WSS"
        };
        
        // 提供反馈
        this.$toast({
          type: "error",
          message: "聊天室连接失败，您仍可以使用其他功能",
          duration: 5000
        });

        // 转入备用模式
        this.enableFallbackMode();
        return;
      }

      const url = addresses[index];
      const that = this;

      try {
        this.websocket = new WebSocket(url);

        // 设置连接超时
        const timeoutId = setTimeout(() => {
          if (this.websocket && this.websocket.readyState !== WebSocket.OPEN) {
            this.websocket.close();
            this.tryWebSocketConnection(addresses, index + 1);
          }
        }, 5000); // 增加到5秒

        this.websocket.onopen = function() {
          clearTimeout(timeoutId);
          that.connectionStatus = "已连接";
          that.retryCount = 0;
          that.wsUrl = url; // 保存成功的URL
          
          // 提供正面反馈
          that.$toast({
            type: "success",
            message: "聊天室已连接",
            duration: 2000
          });

          // 设置心跳检测
          that.heartBeat = setInterval(function() {
            if (that.websocket && that.websocket.readyState === WebSocket.OPEN) {
              try {
                that.websocket.send(JSON.stringify({ type: 6, data: "ping" }));
              } catch {
                clearInterval(that.heartBeat);
                that.connect();
              }
            } else {
              clearInterval(that.heartBeat);
              that.connect();
            }
          }, 30 * 1000);
        };

        this.websocket.onerror = function() {
          clearTimeout(timeoutId);
          that.tryWebSocketConnection(addresses, index + 1);
        };

        this.websocket.onclose = function() {
          clearTimeout(timeoutId);
          if (that.connectionStatus === "已连接") {
            that.connectionStatus = "连接已断开";
            clearInterval(that.heartBeat);
            that.connect();
          }
        };

        this.websocket.onmessage = function(event) {
          try {
            const data = JSON.parse(event.data);
            switch (data.type) {
              case 1:
                // 在线人数
                that.count = data.data;
                break;
              case 2:
                // 历史记录
                that.chatRecordList = data.data.chatRecordList;
                that.chatRecordList.forEach(item => {
                  if (item.type == 5) {
                    that.voiceList.push(item.id);
                  }
                });
                that.ipAddr = data.data.ipAddr;
                that.ipSource = data.data.ipSource;
                break;
              case 3:
                // 文字消息
                that.chatRecordList.push(data.data);
                if (!that.isShow) {
                  that.unreadCount++;
                }
                break;
              case 4:
                // 撤回
                if (data.data.isVoice) {
                  that.voiceList.splice(
                    that.voiceList.indexOf(data.data.id),
                    1
                  );
                }
                for (var i = 0; i < that.chatRecordList.length; i++) {
                  if (that.chatRecordList[i].id == data.data.id) {
                    that.chatRecordList.splice(i, 1);
                    i--;
                  }
                }
                break;
              case 5:
                // 语音消息
                that.voiceList.push(data.data.id);
                that.chatRecordList.push(data.data);
                if (!that.isShow) {
                  that.unreadCount++;
                }
                break;
            }
          } catch {
             
          }
        };
      } catch {
        this.tryWebSocketConnection(addresses, index + 1);
      }
    },
    // 启用备用模式
    enableFallbackMode() {
      this.connectionStatus = "备用模式";
      this.$toast({
        type: "warning",
        message: "已切换至备用模式，部分功能可能受限"
      });

      

      // 在此实现备用模式逻辑，如HTTP轮询
      // ...
    },
    saveMessage(e) {
      if (e) e.preventDefault();
      if (!this.chatEnabled) {
        this.$toast({ type: "warning", message: "聊天室功能已关闭" });
        return false;
      }

      if (this.content.trim() == "") {
        this.$toast({ type: "error", message: "内容不能为空" });
        return false;
      }

      // 解析表情
      var reg = /\[.+?\]/g;
      this.content = this.content.replace(reg, function(str) {
        return (
          "<img style='vertical-align: middle' src= '" +
          EmojiList[str] +
          "' width='22'height='20' style='padding: 0 1px'/>"
        );
      });

      // 根据模式选择发送方式
      if (this.fallbackMode) {
        this.sendMessageByHttp();
      } else {
        // 原有的WebSocket发送方式
        if (!this.checkConnection()) {
          this.$toast({
            type: "warning",
            message: "正在尝试重新连接聊天室..."
          });
          this.connect();
          return false;
        }

        try {
          var socketMsg = {
            nickname: this.nickname,
            avatar: this.avatar,
            content: this.content,
            userId: this.userId,
            type: 3,
            ipAddr: this.ipAddr,
            ipSource: this.ipSource,
            createTime: new Date()
          };
          this.WebsocketMessage.type = 3;
          this.WebsocketMessage.data = socketMsg;
          this.websocket.send(JSON.stringify(this.WebsocketMessage));

          // 清空输入框
          this.content = "";
        } catch (error) {
          
          this.$toast({ type: "error", message: "发送失败，请检查连接" });
        }
      }
    },
    addEmoji(key) {
      this.isEmoji = false;
      this.$refs.chatInput.focus();
      this.content += key;
    },
    // 展示菜单
    showBack(item, index, e) {
      this.$refs.backBtn.forEach(item => {
        item.style.display = "none";
      });

      // 检查是否是自己的消息 - 强化判断逻辑
      const isSelfMessage = this.isSelf(item);

      // 检查消息发送时间是否在2分钟内
      const messageTime = new Date(item.createTime).getTime();
      const currentTime = new Date().getTime();
      const timeDiff = (currentTime - messageTime) / 1000; // 转换为秒
      const canRecall = timeDiff <= 120; // 2分钟内可撤回

      // 只有自己的消息且在时间范围内才显示撤回按钮
      if (isSelfMessage && canRecall) {
        this.$refs.backBtn[index].style.left = e.offsetX + "px";
        this.$refs.backBtn[index].style.bottom = e.offsetY + "px";
        this.$refs.backBtn[index].style.display = "block";
        // 显示剩余可撤回时间
        const remainingTime = Math.ceil(120 - timeDiff);
        this.$refs.backBtn[index].innerHTML = `撤回 (${remainingTime}s)`;
      } else if (isSelfMessage && !canRecall) {
        // 提示消息已超过撤回时间
        this.$toast({
          type: "warning",
          message: "消息发送超过2分钟，无法撤回"
        });
      }
    },
    // 撤回消息
    back(item, index) {
      // 再次验证是否是自己的消息且在可撤回时间内
      const isSelfMessage = this.isSelf(item);
      const messageTime = new Date(item.createTime).getTime();
      const currentTime = new Date().getTime();
      const timeDiff = (currentTime - messageTime) / 1000;

      if (!isSelfMessage) {
        this.$toast({
          type: "error",
          message: "您只能撤回自己的消息"
        });
        return;
      }

      if (timeDiff > 120) {
        this.$toast({
          type: "warning",
          message: "消息发送超过2分钟，无法撤回"
        });
        return;
      }

      // 添加额外安全检查
      // 确保消息的userId与当前用户ID匹配，或者IP地址匹配（对于未登录用户）
      if (item.userId && item.userId !== this.userId) {
        this.$toast({
          type: "error",
          message: "无权撤回该消息"
        });
        return;
      }

      if (!item.userId && item.ipAddr !== this.ipAddr) {
        this.$toast({
          type: "error",
          message: "无权撤回该消息"
        });
        return;
      }

      var socketMsg = {
        id: item.id,
        isVoice: item.type === 5,
        userId: this.userId, // 添加用户ID用于后端验证
        ipAddr: this.ipAddr // 添加IP地址用于后端验证
      };
      this.WebsocketMessage.type = 4;
      this.WebsocketMessage.data = socketMsg;
      this.websocket.send(JSON.stringify(this.WebsocketMessage));
      this.$refs.backBtn[index].style.display = "none";
    },
    closeAll() {
      this.isEmoji = false;
      if (this.chatRecordList.length > 0) {
        this.$refs.backBtn.forEach(item => {
          item.style.display = "none";
        });
      }
    },
    // 录音开始
    translationStart() {
      this.voiceActive = true;
      let that = this;
      that.rc = new Recorderx();
      that.$nextTick(() => {
        that.rc
          .start()
          .then(() => {
            that.startVoiceTime = new Date();
            
          })
          .catch(error => {
            
          });
      });
    },
    // 录音结束
    translationEnd() {
      
      this.voiceActive = false;
      this.rc.pause();
      if (new Date() - this.startVoiceTime < 1000) {
        this.$toast({ type: "error", message: "按键时间太短" });
        return false;
      }
      var wav = this.rc.getRecord({
        encodeTo: ENCODE_TYPE.WAV
      });
      var file = new File([wav], "voice.wav", {
        type: wav.type
      });
      var formData = new window.FormData();
      formData.append("file", file);
      formData.append("type", 5);
      formData.append("nickname", this.nickname);
      formData.append("avatar", this.avatar);
      if (this.userId != null) {
        formData.append("userId", this.userId);
      }
      formData.append("ipAddr", this.ipAddr);
      formData.append("ipSource", this.ipSource);
      formData.append("createTime", new Date());
      var options = {
        url: "/api/voice",
        data: formData,
        method: "post",
        headers: {
          "Content-Type": "multipart/form-data"
        }
      };
      this.axios(options);
    },
    translationmove() {},
    // 播放语音
    playVoice(item) {
      var player = this.$refs.voices[this.voiceList.indexOf(item.id)];
      if (player.paused) {
        player.play();
        this.$refs.plays[this.voiceList.indexOf(item.id)].$el.style.display =
          "none";
        this.$refs.pauses[this.voiceList.indexOf(item.id)].$el.style.display =
          "inline-flex";
      } else {
        this.$refs.plays[this.voiceList.indexOf(item.id)].$el.style.display =
          "inline-flex";
        this.$refs.pauses[this.voiceList.indexOf(item.id)].$el.style.display =
          "none";
        player.pause();
      }
    },
    // 语音结束
    endVoice(item) {
      this.$refs.plays[this.voiceList.indexOf(item.id)].$el.style.display =
        "inline-flex";
      this.$refs.pauses[this.voiceList.indexOf(item.id)].$el.style.display =
        "none";
    },
    // 获取语音时长
    getVoiceTime(item) {
      var time = this.$refs.voices[this.voiceList.indexOf(item.id)].duration;
      time = Math.ceil(time);
      var str = "⬝⬝⬝";
      for (var i = 0; i < time; i++) {
        if (i % 2 == 0) {
          str += "⬝";
        }
      }
      this.$refs.voiceTimes[this.voiceList.indexOf(item.id)].innerHTML =
        " " + str + " " + time + " ''";
    },
    retryConnection() {
      if (!this.chatEnabled) {
        this.connectionStatus = "已关闭";
        return;
      }
      this.retryCount = 0;
      this.connect();
    },
    // 检查连接状态
    checkConnection() {
      if (!this.websocket || this.websocket.readyState !== WebSocket.OPEN) {
        
        this.connectionStatus = "未连接";
        return false;
      }
      
      this.connectionStatus = "已连接";
      return true;
    },
    // 处理回车键
    handleEnterKey(e) {
      // 阻止回车键的默认行为
      e.preventDefault();

      // Shift+Enter换行
      if (e.shiftKey) {
        this.content += "\n";
        return;
      }

      // 普通回车发送消息
      this.saveMessage();
    },
    showDiagnostics() {
      
      alert(`
        用户代理: ${this.diagnosticsInfo.userAgent}
        平台: ${this.diagnosticsInfo.platform}
        网络状态: ${this.diagnosticsInfo.onLine ? "在线" : "离线"}
        WebSocket支持: ${
          this.diagnosticsInfo.webSocketSupport ? "支持" : "不支持"
        }
        当前URL: ${this.currentUrl}
        WebSocket地址: ${this.wsUrl}
      `);
    },
    // 添加轮询模式
    startPolling() {
      this.connectionStatus = "轮询模式";

      // 先获取历史消息
      this.fetchMessages();

      // 设置定期轮询
      this.pollInterval = setInterval(() => {
        this.fetchMessages();
      }, 5000); // 每5秒轮询一次
    },

    fetchMessages() {
      // 使用axios获取最新消息
      const url = `/api/chatMessages?since=${this.lastMessageId}`;
      this.axios
        .get(url)
        .then(response => {
          const data = response.data;
          if (data.success) {
            // 更新消息列表
            if (data.chatRecordList && data.chatRecordList.length > 0) {
              data.chatRecordList.forEach(msg => {
                this.chatRecordList.push(msg);
                if (msg.id > this.lastMessageId) {
                  this.lastMessageId = msg.id;
                }
              });
            }

            // 更新用户信息
            if (data.ipAddr) {
              this.ipAddr = data.ipAddr;
            }
            if (data.ipSource) {
              this.ipSource = data.ipSource;
            }
          }
        })
        .catch(error => {
          
        });
    },

    // 轮询模式下发送消息
    sendMessageByHttp() {
      const messageData = {
        nickname: this.nickname,
        avatar: this.avatar,
        content: this.content,
        userId: this.userId,
        type: 3,
        ipAddr: this.ipAddr,
        ipSource: this.ipSource
      };

      this.axios
        .post("/api/sendMessage", messageData)
        .then(response => {
          if (response.data.success) {
            this.content = "";
            // 立即获取最新消息
            this.fetchMessages();
          } else {
            this.$toast({
              type: "error",
              message: response.data.message || "发送失败"
            });
          }
        })
        .catch(error => {
          
          this.$toast({ type: "error", message: "发送失败，请检查网络" });
        });
    },
    // 测试WebSocket连接
    testWebSocket() {
      if (!this.chatEnabled) {
        this.testResult = "聊天室功能已关闭";
        this.testSuccess = false;
        return;
      }
      this.testResult = "测试中...";
      this.testSuccess = false;

      try {
        const testWs = new WebSocket(this.testWsUrl);

        // 设置连接超时
        const testTimeout = setTimeout(() => {
          this.testResult = "连接超时";
          testWs.close();
        }, 3000);

        testWs.onopen = () => {
          clearTimeout(testTimeout);
          this.testResult = "连接成功!";
          this.testSuccess = true;

          // 连接成功后关闭测试连接
          setTimeout(() => {
            testWs.close();
          }, 1000);
        };

        testWs.onerror = error => {
          clearTimeout(testTimeout);
          this.testResult = "连接失败: " + (error.message || "未知错误");
        };

        testWs.onclose = () => {
          if (this.testResult === "测试中...") {
            this.testResult = "连接已关闭";
          }
        };
      } catch (error) {
        this.testResult = "初始化失败: " + error.message;
      }
    }
  },
  computed: {
    isSelf() {
      return function(item) {
        // 如果当前用户已登录
        if (this.userId) {
          return item.userId === this.userId;
        }
        // 如果当前用户未登录，通过IP地址比较
        return item.ipAddr === this.ipAddr;
      };
    },
    isleft() {
      return function(item) {
        return this.isSelf(item)
          ? "user-avatar right-avatar"
          : "user-avatar left-avatar";
      };
    },
    isMyContent() {
      return function(item) {
        return this.isSelf(item) ? "my-content" : "user-content";
      };
    },
    isMyMessage() {
      return function(item) {
        return this.isSelf(item) ? "my-message" : "user-message";
      };
    },
    nickname() {
      return this.$store.state.nickname != null
        ? this.$store.state.nickname
        : this.ipAddr;
    },
    avatar() {
      return this.$store.state.avatar != null
        ? this.$store.state.avatar
        : "https://big-event20040810.oss-cn-beijing.aliyuncs.com/avatar/default.png";
    },
    userId() {
      return this.$store.state.userId;
    },
    isInput() {
      return this.content.trim() != ""
        ? "iconfont iconzhifeiji submit-btn"
        : "iconfont iconzhifeiji";
    }
  },
  mounted() {
    this.chatEnabled = Boolean(this.config.CHAT_ROOM_ENABLED);
    if (!this.chatEnabled) {
      this.connectionStatus = "已关闭";
      return;
    }
    // 检测移动设备
    const userAgent = navigator.userAgent.toLowerCase();
    this.isMobileDevice = /iphone|ipad|ipod|android/.test(userAgent);
    

    // 针对移动设备的特殊处理
    if (this.isMobileDevice) {
      // 移动设备可能需要用户交互后才能建立WebSocket连接
      
      // 不自动连接，而是在点击按钮时连接
    } else {
      // 桌面设备直接连接
      this.connect();
    }
  }
};
</script>

<style scoped>
@media (min-width: 760px) {
  .chat-container {
    position: fixed;
    bottom: 104px;
    right: 20px;
    height: calc(85% - 64px - 20px);
    max-height: 590px !important;
    min-height: 250px !important;
    width: 400px !important;
    border-radius: 16px !important;
  }
  .close {
    display: none;
  }
}
@media (max-width: 760px) {
  .chat-container {
    position: fixed;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
  }
  .close {
    display: block;
    margin-left: auto;
  }
}
.chat-container {
  box-shadow: 0 5px 40px rgba(0, 0, 0, 0.16) !important;
  font-size: 14px;
  background: #f4f6fb;
  z-index: 1200;
}
.chat-btn {
  position: fixed;
  bottom: 15px;
  right: 5px;
  cursor: pointer;
  height: 60px !important;
  width: 60px !important;
  z-index: 1000 !important;
  user-select: none;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s ease;
}

.chat-btn:hover {
  transform: scale(1.1);
}

.unread {
  text-align: center;
  border-radius: 50%;
  font-size: 14px;
  height: 20px;
  width: 20px;
  position: absolute;
  top: 0;
  right: 0;
  background: #f24f2d;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
}
.header {
  display: flex;
  align-items: center;
  padding: 20px 24px;
  background: #ffffff;
  border-radius: 1rem 1rem 0 0;
  box-shadow: 0 10px 15px -16px rgba(50, 50, 93, 0.08),
    0 4px 6px -8px rgba(50, 50, 93, 0.04);
}
.footer {
  padding: 8px 16px;
  position: absolute;
  width: 100%;
  bottom: 0;
  background: #f7f7f7;
  border-radius: 0 0 1rem 1rem;
  display: flex;
  align-items: center;
}
.footer textarea {
  background: #fff;
  padding-left: 10px;
  padding-top: 8px;
  width: 100%;
  height: 32px;
  outline: none;
  resize: none;
  overflow: hidden;
  font-size: 13px;
}
.voice-btn {
  font-size: 13px;
  outline: none;
  height: 32px;
  width: 100%;
  background: #fff;
  border-radius: 2px;
}
.message {
  position: absolute;
  width: 100%;
  padding: 20px 16px 0 16px;
  top: 80px;
  bottom: 50px;
  overflow-y: auto;
  overflow-x: hidden;
}
.text {
  color: #999;
  text-align: center;
  font-size: 12px;
  margin-bottom: 12px;
}
.user-message {
  display: flex;
  margin-bottom: 10px;
}
.my-message {
  display: flex;
  margin-bottom: 10px;
  justify-content: flex-end;
}
.left-avatar {
  margin-right: 10px;
}
.right-avatar {
  order: 1;
  margin-left: 10px;
}
.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}
.nickname {
  display: flex;
  align-items: center;
  font-size: 12px;
  margin-top: 3px;
  margin-bottom: 5px;
}
.user-content {
  position: relative;
  background-color: #fff;
  padding: 10px;
  border-radius: 5px 20px 20px 20px;
  width: fit-content;
}
.my-content {
  position: relative;
  border-radius: 20px 5px 20px 20px;
  padding: 12px;
  background: #12b7f5;
  color: #fff;
}
.submit-btn {
  color: rgb(31, 147, 255);
}
.emoji-box {
  position: absolute;
  box-shadow: 0 8px 16px rgba(50, 50, 93, 0.08), 0 4px 12px rgba(0, 0, 0, 0.07);
  background: #fff;
  border-radius: 8px;
  right: 20px;
  bottom: 52px;
  height: 240px;
  width: 320px;
  overflow-y: auto;
  padding: 12px;
  z-index: 1000;
}
.emoji-box::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
.emoji-box::-webkit-scrollbar-thumb {
  border-radius: 3px;
  background: #c1c1c1;
}
.emoji-box::-webkit-scrollbar-track {
  border-radius: 3px;
  background: #f5f5f5;
}
.emoji-border {
  position: absolute;
  right: 43px;
  bottom: 40px;
  width: 0;
  height: 0;
  border-left: 8px solid transparent;
  border-right: 8px solid transparent;
  border-top: 8px solid #fff;
  z-index: 1000;
}
.emoji {
  cursor: pointer;
  font-size: 1.3rem;
  margin: 0 8px;
  color: #666;
  transition: color 0.2s;
}
.emoji:hover {
  color: #ffc83d;
}
.back-menu {
  font-size: 12px;
  border-radius: 4px;
  position: absolute;
  background: rgba(0, 0, 0, 0.7);
  color: #fff;
  min-width: 90px;
  height: 32px;
  text-align: center;
  line-height: 32px;
  display: none;
  cursor: pointer;
  transition: background-color 0.3s;
}

.back-menu:hover {
  background: rgba(0, 0, 0, 0.8);
}
.voice {
  position: fixed;
  z-index: 1500;
  bottom: 52px;
  left: 0;
  right: 0;
  top: 80px;
  background: rgba(0, 0, 0, 0.8);
}
.close-voice {
  position: absolute;
  bottom: 60px;
  left: 30px;
  display: inline-block;
  height: 50px;
  width: 50px;
  line-height: 50px;
  border-radius: 50%;
  text-align: center;
  background: #fff;
}
.text-right {
  text-align: right;
}
.connection-error {
  text-align: center;
  padding: 20px;
  color: #ff4d4f;
}

.retry-btn {
  background: #1890ff;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 10px;
}

.connection-details {
  font-size: 12px;
  margin: 10px 0;
  background: rgba(0, 0, 0, 0.05);
  padding: 8px;
  border-radius: 4px;
  text-align: left;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.secondary {
  background: #666;
  margin-left: 8px;
}

.test-tools {
  margin: 10px 0;
  display: flex;
  justify-content: center;
}

.test-input {
  padding: 8px;
  width: 60%;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-right: 8px;
}

.test-success {
  color: #52c41a;
  font-weight: bold;
}

.test-error {
  color: #f5222d;
  font-weight: bold;
}

/* 深色模式样式 */
.theme--dark .chat-container,
[data-theme='dark'] .chat-container,
body.theme-dark .chat-container {
  background-color: #1e1e1e;
  color: #ffffff;
  box-shadow: 0 5px 40px rgba(0, 0, 0, 0.3) !important;
}

/* 聊天界面头部 */
.theme--dark .header,
[data-theme='dark'] .header,
body.theme-dark .header {
  background-color: #2c2c2c;
  color: #ffffff;
  box-shadow: 0 10px 15px -16px rgba(0, 0, 0, 0.2), 0 4px 6px -8px rgba(0, 0, 0, 0.1);
}

/* 聊天界面底部 */
.theme--dark .footer,
[data-theme='dark'] .footer,
body.theme-dark .footer {
  background-color: #2c2c2c;
}

/* 输入框 */
.theme--dark .footer textarea,
.theme--dark .voice-btn,
[data-theme='dark'] .footer textarea,
[data-theme='dark'] .voice-btn,
body.theme-dark .footer textarea,
body.theme-dark .voice-btn {
  background-color: #383838;
  color: #ffffff;
  border: 1px solid #444444;
}

/* 聊天消息 - 他人 */
.theme--dark .user-content,
[data-theme='dark'] .user-content,
body.theme-dark .user-content {
  background-color: #383838;
  color: #ffffff;
}

/* 聊天气泡 - 自己 */
.theme--dark .my-content,
[data-theme='dark'] .my-content,
body.theme-dark .my-content {
  background-color: #0d6efd; /* 使用更深的蓝色 */
  color: #ffffff;
}

/* 昵称和时间 */
.theme--dark .nickname,
[data-theme='dark'] .nickname,
body.theme-dark .nickname {
  color: #bbbbbb;
}

/* 表情选择器 */
.theme--dark .emoji-box,
[data-theme='dark'] .emoji-box,
body.theme-dark .emoji-box {
  background-color: #2c2c2c;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2), 0 4px 12px rgba(0, 0, 0, 0.15);
}

.theme--dark .emoji-border,
[data-theme='dark'] .emoji-border,
body.theme-dark .emoji-border {
  border-top-color: #2c2c2c;
}

/* 表情图标 */
.theme--dark .emoji,
[data-theme='dark'] .emoji,
body.theme-dark .emoji {
  color: #bbbbbb;
}

.theme--dark .emoji:hover,
[data-theme='dark'] .emoji:hover,
body.theme-dark .emoji:hover {
  color: #ffc83d;
}

/* 发送按钮 */
.theme--dark .submit-btn,
[data-theme='dark'] .submit-btn,
body.theme-dark .submit-btn {
  color: #4dabf7;
}

/* 撤回菜单 */
.theme--dark .back-menu,
[data-theme='dark'] .back-menu,
body.theme-dark .back-menu {
  background: rgba(0, 0, 0, 0.8);
}

/* 连接错误提示 */
.theme--dark .connection-error,
[data-theme='dark'] .connection-error,
body.theme-dark .connection-error {
  color: #ff6b6b;
}

/* 重试按钮 */
.theme--dark .retry-btn,
[data-theme='dark'] .retry-btn,
body.theme-dark .retry-btn {
  background-color: #1890ff;
  color: #ffffff;
}

/* 测试工具输入框 */
.theme--dark .test-input,
[data-theme='dark'] .test-input,
body.theme-dark .test-input {
  background-color: #383838;
  color: #ffffff;
  border-color: #444444;
}

/* 测试结果 */
.theme--dark .test-success,
[data-theme='dark'] .test-success,
body.theme-dark .test-success {
  color: #52c41a;
}

.theme--dark .test-error,
[data-theme='dark'] .test-error,
body.theme-dark .test-error {
  color: #ff4d4f;
}

/* 聊天室滚动条 */
.theme--dark .message::-webkit-scrollbar-track,
[data-theme='dark'] .message::-webkit-scrollbar-track,
body.theme-dark .message::-webkit-scrollbar-track {
  background-color: #2c2c2c;
}

.theme--dark .message::-webkit-scrollbar-thumb,
[data-theme='dark'] .message::-webkit-scrollbar-thumb,
body.theme-dark .message::-webkit-scrollbar-thumb {
  background-color: #555555;
}

/* 语音录制遮罩 */
.theme--dark .close-voice,
[data-theme='dark'] .close-voice,
body.theme-dark .close-voice {
  background-color: #383838;
  color: #ffffff;
}
</style>
