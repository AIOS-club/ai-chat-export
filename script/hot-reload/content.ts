import type { Plugin } from "vite";
import WebSocket from "ws";
import { contentUpdatePort, isDev } from "../../const";

const hotReloadContent = (): Plugin => {
  let wsClient = null;
  let isReady = false;
  const connectWs = () => {
    try {
      if (wsClient === null) {
        wsClient = new WebSocket({ port:contentUpdatePort});
        wsClient.onopen = () => {
          isReady = true;
        };
        wsClient.on('connection', function connection(ws) {
          // 启动心跳监听，便于重连
          ws.send('heartbeatMonitor')
          const interval = setInterval(() => {
            ws.send('heartbeat')
          }, 3000);
    
          ws.on('message', (message) => {
            const info = `${message}`
            // 监听contentScript代码变化，复用一个ws连接
            if (info === 'UPDATE_CONTENT_SCRIPT') {
              wsClient.clients.forEach((ws) => {
                ws.send('UPDATE_CONTENT_SCRIPT')
              })
            }
          })
    
          ws.on('close', () => {
            clearInterval(interval);
          })
        })
      }
    } catch (e) {
      setTimeout(connectWs, 1000);
    }
  };

  return {
    name: "hot-reload-content",
    enforce: "pre",
    configResolved() {
      if (isDev) {
        connectWs();
      }
    },
    writeBundle() {
      // 通过socket触发reload
      if (wsClient && isReady) {
        wsClient.send("UPDATE_CONTENT_SCRIPT");
      }
    },
  };
};

export default hotReloadContent;
