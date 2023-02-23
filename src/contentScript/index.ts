import { createApp } from "vue";
import App from "./index.vue";

(() => {
  const rootIdName = "ai_chat_crx_content_script";
  const beforeRoot = document.querySelector(`#${rootIdName}`);
  if (beforeRoot) {
    document.body.removeChild(beforeRoot);
  }
  const container = document.createElement("div");
  container.id = rootIdName;
  const root = document.createElement("div");
  const styleEl = document.createElement("link");
  const shadowDOM = container.attachShadow?.({ mode: "closed" }) || container;
  styleEl.setAttribute("rel", "stylesheet");
  styleEl.setAttribute("href", chrome.runtime.getURL("style.css"));
  shadowDOM.appendChild(styleEl);
  shadowDOM.appendChild(root);
  document.body.appendChild(container);
  const app = createApp(App);
  app.mount(root);
})();
