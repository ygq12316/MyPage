<template>
  <div class="emoji-list" v-show="chooseEmoji">
    <div
      v-for="(value, key) in emojiList"
      :key="key"
      class="emoji-item"
      @click="handleEmojiClick(key)"
    >
      <img :src="value" width="24" height="24" />
    </div>
  </div>
</template>

<script>
import emojiList from "@/assets/js/emoji";

export default {
  name: "Emoji",
  props: {
    chooseEmoji: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      emojiList: emojiList
    };
  },
  methods: {
    handleEmojiClick(key) {
      this.$emit("addEmoji", key);
    }
  }
};
</script>

<style scoped>
.emoji-list {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: 8px;
  background-color: #fff;
  border: 1px solid #eee;
  border-radius: 4px;
  padding: 8px;
  margin-top: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  position: relative;
  z-index: 100;
}

.emoji-item {
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.emoji-item:hover {
  background-color: #f0f0f0;
}

.emoji-item img {
  display: block;
}

/* 深色模式样式 */
:root[data-theme='dark'] .emoji-list,
body.theme-dark .emoji-list {
  background-color: #2c2c2c;
  border-color: #444444;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.3);
}

:root[data-theme='dark'] .emoji-item:hover,
body.theme-dark .emoji-item:hover {
  background-color: #3c3c3c;
}
</style>
