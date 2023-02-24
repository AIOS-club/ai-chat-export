<script lang="ts">
import { defineComponent, ref } from "vue";
import { exportYaml } from "../utils";

export default defineComponent({
  setup() {
    const tipShow = ref(false);

    const handleExportClick = () => {
      if (tipShow.value) return;
      tipShow.value = true;

      const text = exportYaml();
      if (!text) {
        window.alert("暂无对话可导出");
      }
      setTimeout(() => {
        tipShow.value = false;
      }, 1000);
    };

    return {
      tipShow,
      handleExportClick,
    };
  },
});
</script>
<template>
  <div>
    <div
      class="ai-chat-export-btn"
      :class="{ 'ai-chat-export-btn-disabled': tipShow }"
      @click.stop="handleExportClick"
    >
      导出yaml
    </div>
  </div>
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
  background-color: #6741ef;
  color: #fff;
  cursor: pointer;
  width: 80px;
  height: 30px;
  border-radius: 4px 0 0 4px;
  transition: background-color 0.2s;
}
.ai-chat-export-btn:not(.ai-chat-export-btn-disabled):hover {
  background-color: #876ce7;
}
.ai-chat-export-btn-disabled {
  cursor: not-allowed;
  background-color: #6741ef;
}
</style>
