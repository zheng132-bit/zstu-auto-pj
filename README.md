# 浙江理工大学一键评教脚本

一个 Node.js 小脚本,自动给浙理教务系统的待评课程提交"最高档"评价。  
**仅供学习与个人效率使用,请勿用于任何违反学校规定或教务政策的场景。**



## 使用方法

### 1. 登录教务系统获取 Cookie

浏览器打开 [学生评教页面](https://jwglxt.zstu.edu.cn/jwglxt/xspjgl/xspj_cxXspjIndex.html?doType=details&gnmkdm=N401605&layout=default) 并登录。

按 `F12` 打开 DevTools → `Network` 面板 → 刷新页面 → 找到任意一个 `xspj_` 开头的请求 → 在 `Request Headers` 里复制整段 `Cookie` 的值

### 2. 填入 Cookie

把复制好的 Cookie 粘贴到 `main.js` 最顶部的 `COOKIE` 常量里。

### 3. 运行

```bash
node main.js
```




## 免责声明

本脚本仅用于个人学习与效率提升。  
使用本脚本所产生的任何后果(包括但不限于被系统判定违规、影响评教结果等)由使用者自行承担,与作者无关。
