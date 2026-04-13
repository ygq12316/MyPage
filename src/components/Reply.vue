<template>
  <div
    class="reply-input-wrapper"
    :style="{ display: isVisible ? 'block' : 'none' }"
    ref="reply"
  >
    <textarea
      class="comment-textarea"
      :placeholder="'回复 @' + nickname + '：'"
      auto-grow
      dense
      v-model="commentContent"
    />
    <div class="emoji-container">
      <span
        :class="chooseEmoji ? 'emoji-btn-active' : 'emoji-btn'"
        @click="toggleEmoji"
      >
        <i class="iconfont iconbiaoqing" />
      </span>
      <div style="margin-left:auto">
        <button @click="cancleReply" class="cancle-btn v-comment-btn">
          取消
        </button>
        <button @click="insertReply" class="upload-btn v-comment-btn">
          提交
        </button>
      </div>
    </div>
    <!-- 表情框 -->
    <emoji @addEmoji="addEmoji" :chooseEmoji="chooseEmoji"></emoji>
  </div>
</template>

<script>
import Emoji from "./Emoji";
import EmojiList from "../assets/js/emoji";
export default {
  components: {
    Emoji
  },
  data: function() {
    return {
      index: 0,
      chooseEmoji: false,
      nickname: "",
      replyId: null,
      parentId: null,
      commentContent: "",
      isVisible: false // 新增控制显示的数据属性
    };
  },
  methods: {
    cancleReply() {
      this.isVisible = false; // 使用 isVisible 来控制显示
      this.commentContent = ""; // 清空内容
    },

    // 新增方法用于显示回复框
    showReply() {
      this.isVisible = true;
    },

    // 切换表情选择器
    toggleEmoji() {
      this.chooseEmoji = !this.chooseEmoji;
    },

    insertReply() {
      //判断登录
      if (!this.$store.state.userId) {
        this.$store.state.loginFlag = true;
        return false;
      }
      if (this.commentContent.trim() == "") {
        this.$toast({ type: "error", message: "回复不能为空" });
        return false;
      }
      //解析表情
      var reg = /\[.+?\]/g;
      this.commentContent = this.commentContent.replace(reg, function(str) {
        return (
          "<img src= '" +
          EmojiList[str] +
          "' width='22'height='20' style='padding: 0 1px'/>"
        );
      });
      const path = this.$route.path;
      const arr = path.split("/");
      var comment = {
        articleId: arr[2],
        replyId: this.replyId,
        parentId: this.parentId,
        commentContent: this.commentContent
      };
      this.commentContent = "";
      this.axios.post("/api/comments", comment).then(({ data }) => {
        if (data.flag) {
          this.isVisible = false;
          this.$emit("reloadReply", this.index);
          this.$toast({ type: "success", message: "回复成功" });
        } else {
          this.$toast({ type: "error", message: data.message });
        }
      });
    },

    addEmoji(text) {
      this.commentContent += text;
      // 保持表情选择器打开状态
      this.chooseEmoji = true;
    }
  }
};
</script>

<style scoped>
.reply-input-wrapper {
  border: 1px solid #90939950;
  border-radius: 4px;
  padding: 10px;
  margin: 0 0 10px;
  position: relative;
  z-index: 5;
  background-color: #fff;
}

/* 回复输入框样式 */
.comment-textarea {
  width: 100%;
  min-height: 70px;
  border: none;
  outline: none;
  padding: 8px 0;
  resize: vertical;
  font-size: 14px;
}
</style>
