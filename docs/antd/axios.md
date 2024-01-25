# 关于 axios 第一次请求，headers 无法获取到token,需要刷新后才可获取到的解决方案

```js
const instance = axios.create({
    // baseURL: "http://175.30.32.3:48080",
    timeout: 120000,
    headers: { Authorization: 'Bearer ' + getToken(), 'Content-Type': 'application/json;charset=UTF-8' },

//  开始是全局添加的 headers, 如上， 没有做处理，就会出现第一次登陆后， 带不上token的情况。

    transformRequest: [function (data, headers) {
      headers['Authorization'] = 'Bearer ' + localStorage.getItem('token')
      return JSON.stringify(data)
    }]

```


## 寻求解决方案，transformRequest，可以在请求发送前对请求处理， 但是有个很关键的问题，就是默认使用transformRequest处理后，请求体内容回默认变成 formData,导致所有请求都失败，
[再次寻求解决方案， 结果解决方案很简单，请求体带上'content-type:application/json;charset=UTF-8']  