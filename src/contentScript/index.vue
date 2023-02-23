<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  setup() {},
});
</script>
<template>
  <div class="ai-chat-export-btn">导出yaml</div>
</template>

<style scoped>
.ai-chat-export-btn {
  position: fixed;
  top: 24px;
  right: 0;
  z-index: 99999;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #6741ef;
  color: #fff;
  cursor: pointer;
  transition: opacity 0.2s;
}
.ai-chat-export-btn:hover {
  opacity: 0.8;
}
</style>
