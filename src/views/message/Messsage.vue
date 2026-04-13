<template>
  <div>
    <!-- banner -->
    <div class="message-banner">
      <!-- 弹幕输入框 -->
      <div class="message-container">
        <h1 class="message-title">留言板</h1>
        <div class="animated fadeInUp message-input-wrapper">
          <input
            v-model="messageContent"
            @click="show = true"
            @keyup.enter="addToList"
            placeholder="说点什么吧"
          />
          <button
            class="ml-3 animated bounceInLeft"
            @click="addToList"
            v-show="show"
          >
            发送
          </button>
        </div>
      </div>
      <!-- 弹幕列表 -->
      <div class="barrage-container">
        <vue-baberrage
          :isShow="barrageIsShow"
          :barrageList="barrageList"
          :loop="true"
          :maxLength="100"
          :boxHeight="containerHeight"
          :loopCount="-1"
          :randomChannel="true"
        >
          <template slot-scope="props">
            <div class="barrage-items">
              <img
                :src="props.item.avatar"
                onerror="this.src='https://big-event20040810.oss-cn-beijing.aliyuncs.com/avatar/default.png'"
              />
              <span>{{ props.item.msg }}</span>
            </div>
          </template>
        </vue-baberrage>
      </div>
    </div>
  </div>
</template>

<script>
import { vueBaberrage } from 'vue-baberrage'

export default {
  name: 'Message',
  components: {
    vueBaberrage
  },
  data() {
    return {
      show: false,
      messageContent: "",
      barrageList: [],
      barrageIsShow: true,
      containerHeight: 0
    };
  },
  mounted() {
    this.listMessage();
    this.containerHeight = window.innerHeight - 100;
    window.addEventListener('resize', this.updateHeight);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.updateHeight);
  },
  methods: {
    updateHeight() {
      this.containerHeight = window.innerHeight - 100;
    },
    listMessage() {
      this.axios.get("/api/messages").then(({ data }) => {
        if (data.flag) {
          // 转换为新弹幕组件格式，添加随机速度
          this.barrageList = data.data.map(item => ({
            id: item.id,
            avatar: item.avatar,
            msg: item.messageContent,
            time: this.getRandomSpeed(), // 随机速度
            type: 0
          }));
        }
      });
    },
    getRandomSpeed() {
      // 返回 6-10 之间的随机数
      return Math.floor(Math.random() * 4) + 6;
    },
    addToList() {
      if (this.messageContent.trim() == "") {
        this.$toast({ type: "error", message: "留言不能为空" });
        return false;
      }

      const message = {
        id: Date.now(),
        avatar: this.$store.state.avatar || "https://big-event20040810.oss-cn-beijing.aliyuncs.com/avatar/default.png",
        msg: this.messageContent,
        time: this.getRandomSpeed(), // 使用随机速度
        type: 0
      };

      this.barrageList.push(message);
      this.messageContent = "";
      
      // 发送到服务器的格式
      const serverMessage = {
        messageContent: message.msg,
        avatar: message.avatar,
        nickname: this.$store.state.nickname || "游客"
      };
      
      this.axios.post("/api/messages", serverMessage).then(({data}) => {
        if (data.flag) {
          this.$toast({ type: "success", message: "留言成功" });
        } else {
          this.$toast({ type: "error", message: data.message });
        }
      });
    }
  }
};
</script>

<style scoped>
.message-banner {
  position: absolute;
  top: -60px;
  left: 0;
  right: 0;
  height: 100vh;
  /* 添加备用背景色，以防图片加载失败 */
  background-color: #49b1f5;
  background-image: url('@/assets/img/6.jpg');
  background-position: center center;
  background-size: cover;
  background-repeat: no-repeat;
  animation: header-effect 1s;
}
.message-title {
  color: #eee;
  animation: title-scale 1s;
}
.message-container {
  position: absolute;
  width: 360px;
  top: 35%;
  left: 0;
  right: 0;
  text-align: center;
  z-index: 5;
  margin: 0 auto;
  color: #fff;
}
.message-input-wrapper {
  display: flex;
  justify-content: center;
  height: 2.5rem;
  margin-top: 2rem;
}
.message-input-wrapper input {
  outline: none;
  width: 70%;
  border-radius: 20px;
  height: 100%;
  padding: 0 1.25rem;
  color: #eee;
  border: #fff 1px solid;
}
.message-input-wrapper input::-webkit-input-placeholder {
  color: #eeee;
}
.message-input-wrapper button {
  outline: none;
  border-radius: 20px;
  height: 100%;
  padding: 0 1.25rem;
  border: #fff 1px solid;
}
.barrage-container {
  position: absolute;
  top: 50px;
  left: 0;
  right: 0;
  bottom: 0;
  height: calc(100vh - 100px) !important;
  width: 100%;
  overflow: hidden;
  z-index: 1;
}
.barrage-items {
  display: inline-flex;
  align-items: center;
  background: rgba(0, 0, 0, 0.7);
  border-radius: 100px;
  padding: 5px 10px 5px 5px;
  color: #ffffff;
  white-space: nowrap;
}
.barrage-items img {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  vertical-align: middle;
  margin-right: 8px;
  object-fit: cover;
}
.barrage-items span {
  color: #ffffff;
  font-weight: 500;
  text-shadow: 0 0 2px rgba(0, 0, 0, 0.3);
  display: inline-block;
  vertical-align: middle;
  line-height: 30px;
}

/* 确保弹幕容器样式正确 */
:deep(.vue-danmaku) {
  width: 100% !important;
  height: 100% !important;
}

:deep(.vue-danmaku-item) {
  display: inline-block !important;
}
</style>
