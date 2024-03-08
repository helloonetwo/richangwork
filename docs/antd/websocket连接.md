
# websocket连接

```js
import { ref } from "vue";

const { DEV, VITE_APP_PUSH_WS } = import.meta.env;
const { push_ws } = window.WEB_CONFIG;
const baseWsUrl = DEV ? VITE_APP_PUSH_WS : push_ws;
// 斷線重連timer
let reconectTimer = null;
// websocket鏈接狀態
let socketStatus = false;
// webSocket token
//给请求头设置token
let token = window.localStorage.getItem("token") || "";
export const websocketNoteObj = ref();
// export const websocketNoteObj = ref();
export const websocketNoteUrl = ref();
// 重連websocket
const reconect = () => {
  if (reconectTimer) return;

  socketStatus = false;

  reconectTimer = window.setInterval(() => {
    initSocket();
  }, 5000);

  // initSocket()
};

const initSocket = (is_collect) => {
  let ws = new WebSocket(`${baseWsUrl}/22222222?access_token=${token}&is_collect=${is_collect}`);
  // 注单end
  // 心跳檢測timer
  let heartbeatTimer = null;

  ws.onopen = () => {
    window.clearInterval(reconectTimer);
    socketStatus = true;

    // 心跳检测，建议客户端每30秒发送一次此事件消息。客户端超过6分钟没有发送此事件，则连接会从服务端剔除
    heartbeatTimer = setInterval(() => {
      ws.send(JSON.stringify({ event: "heartbeat" }));
    }, 3000);
  };

  ws.addEventListener("close", () => {
    ws.close();
    console.log("websocket onclose");
    window.clearInterval(heartbeatTimer);
    reconect();
  });
  ws.addEventListener("error", () => {
    ws.close();
    console.log("websocket onerror");
    window.clearInterval(heartbeatTimer);
    reconect();
  });

  websocketNoteObj.value = ws;
};

export const initWebsocketObj = (is_collect) => {
  initSocket(is_collect);
};

```

## 携带token  

```js
let ws = new WebSocket(`${baseWsUrl}/22222222?access_token=${token}&is_collect=${is_collect}`);
```