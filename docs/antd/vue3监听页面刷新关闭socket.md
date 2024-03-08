# vue3监听页面刷新关闭socket


```js
//关闭websocket
const closeWebsocket = (e) => {
  console.log("close", e);
  websocketNoteObj.value & websocketNoteObj.value.close();
};
//绑定事件
window.addEventListener("beforeunload", (e) => closeWebsocket(e));
onUnmounted(() => {
  console.log("销毁");
  // 在组件销毁前清除定时器
  clearInterval(timer);
  //卸载事件
  window.removeEventListener("beforeunload", (e) => closeWebsocket(e));
});

```