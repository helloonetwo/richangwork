```vue
<!-- 监听窗口关闭 -->
<script setup>
import { onMounted, onUnmounted } from 'vue'

let _beforeUnload_time = '';
let _gap_time = '';


let beforeunloadHandler = (e) => {
    _beforeUnload_time = new Date().getTime();
    //e.returnValue = '关闭提示'; 弹窗
};
let unloadHandler = (e) => {
    _gap_time = new Date().getTime() - _beforeUnload_time;
    //判断是窗口关闭还是刷新
    if (_gap_time <= 5) {
        console.log('xxxxxxxx');
        // 退出登录 
        // xxxxxxxx
        // 通知后台
        // xxxxxxxx
    }
};


onMounted(() => {
    window.addEventListener("beforeunload", (e) => beforeunloadHandler(e));
    window.addEventListener("unload", (e) => unloadHandler(e));

})

onUnmounted(() => {
    window.removeEventListener("beforeunload", (e) => beforeunloadHandler(e));
    window.removeEventListener("unload", (e) => unloadHandler(e));
})

</script>

```