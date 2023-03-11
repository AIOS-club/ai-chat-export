<script lang="ts">
import { defineComponent, ref } from "vue";
import { exportYaml } from "../utils";
import { exportJson } from "../exportJson";

export default defineComponent({
  setup() {
    enum IExportType {
      YAML = "YAML",
      PNG = "PNG",
      SVG = "SVG",
      JSON = "JSON",
    }
    const tipShow = ref(false);
    const isMenuShow = ref(false);

    const handleExportClick = (type: IExportType) => {
      if (tipShow.value) return;
      tipShow.value = true;
      let isSuccess = true;

      switch (type) {
        case IExportType.YAML:
          isSuccess = !!exportYaml();
          break;
        case IExportType.JSON:
          isSuccess = !!exportJson();
      }

      if (!isSuccess) {
        window.alert("暂无对话可导出");
      }
      setTimeout(() => {
        tipShow.value = false;
      }, 1000);
    };

    const handleMouseEnter = () => {
      isMenuShow.value = true;
    };

    const handleMouseLeave = () => {
      isMenuShow.value = false;
    };

    return {
      tipShow,
      isMenuShow,
      IExportType,
      handleExportClick,
      handleMouseEnter,
      handleMouseLeave,
    };
  },
});
</script>
<template>
  <div class="ai-chat-export-btn-wrap" :class="{ 'ai-chat-export-disabled': tipShow }" @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave">
    <div class="ai-chat-export-btn" :class="{ 'ai-chat-export-btn-hover': isMenuShow }">
      <svg
        t="1677574419519"
        class="export-btn-icon"
        viewBox="0 0 1024 1024"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        p-id="2789"
        width="160"
        height="160"
      >
        <path
          d="M849.2 599v217H178.5V599c-0.7-23.7-20.1-42.7-44-42.7s-43.3 19-44 42.7v252.5c0 28.9 23.6 52.5 52.5 52.5h741.7c28.9 0 52.5-23.6 52.5-52.5V599c-0.7-23.7-20.1-42.7-44-42.7s-43.3 19-44 42.7z"
          p-id="2790"
          fill="#fff"
        ></path>
        <path
          d="M482.7 135.4l-164 164c-17.1 17.1-17.1 45.1 0 62.2s45.1 17.1 62.2 0l85.7-85.7v314.8c0 26 21.3 47.2 47.2 47.2 26 0 47.2-21.3 47.2-47.2V276l85.7 85.7c17.1 17.1 45.1 17.1 62.2 0s17.1-45.1 0-62.2l-164-164c-17.1-17.2-45.1-17.2-62.2-0.1z"
          p-id="2791"
          fill="#fff"
        ></path>
      </svg>
    </div>
    <transition name="animated">
      <div v-show="isMenuShow" class="export-btn-list">
        <div class="export-btn-item yaml" @click.stop="handleExportClick(IExportType.YAML)">另存为 YAML</div>
        <div class="export-btn-item json" @click.stop="handleExportClick(IExportType.JSON)">另存为 JSON</div>
        <!-- <div class="export-btn-item csv">导出 csv</div> -->
      </div>
    </transition>
  </div>
</template>

<style scoped>
.ai-chat-export-btn-wrap {
  position: fixed;
  display: flex;
  flex-direction: column;
  top: 24px;
  right: 4px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  align-items: end;
  cursor: pointer;
  font-weight: 600;
}

.ai-chat-export-disabled {
  cursor: not-allowed;
}

.ai-chat-export-btn {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #6741ef;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  box-shadow: 0 2px 10px 0 rgba(56, 35, 219, 0.1);
  transition: opacity 0.2s;
}
.ai-chat-export-btn-hover {
  opacity: 0.8;
}
.export-btn-icon {
  width: 24px;
  height: 24px;
}
.export-btn-item {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 110px;
  height: 32px;
  border-radius: 16px;
  color: #fff;
  background-color: #7d5bf6;
  margin-top: 6px;
  font-size: 14px;
  transition: opacity 0.2s;
}
.export-btn-item:hover {
  opacity: 0.8;
}

.animated-enter-active {
  transition: all 0.5s;
}
.animated-enter-active .yaml {
  animation: show-yaml 240ms ease-in-out forwards;
}
.animated-enter-active .json {
  opacity: 0;
  animation: show-json 300ms ease-in-out forwards;
  animation-delay: 0.12s !important;
}
.animated-enter-active .csv {
  opacity: 0;
  animation: show-csv 300ms ease-in-out forwards;
  animation-delay: 0.28s !important;
}

.animated-leave-active {
  transition: all 0.25s;
}
.animated-leave-active .yaml {
  animation: show-yaml 200ms ease-in-out forwards alternate-reverse;
  animation-delay: 60ms !important;
}
.animated-leave-active .json {
  animation: show-json 200ms ease-in-out forwards alternate-reverse;
  animation-delay: 30ms !important;
}
.animated-leave-active .csv {
  animation: show-csv 200ms ease-in-out forwards alternate-reverse;
}

@keyframes show-yaml {
  0% {
    opacity: 0;
    transform: translateY(-20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
@keyframes show-json {
  0% {
    opacity: 0;
    transform: translateY(-38px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
@keyframes show-csv {
  0% {
    opacity: 0;
    transform: translateY(-38px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
