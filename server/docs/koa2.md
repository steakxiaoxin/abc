# koa2

> 前言：
>
> - express 中间件是异步回调，koa2 原生支持 async/await
> - 型开发框架和系统，都开始基于 koa2，例如 egg.js
> - express 虽然未过时，但是 koa2 肯定是未来趋势



async await 要点

1. await 后面可以追加 Promise 对象
2. await 必须包裹在 async 函数里面
3. async 函数执行返回也是一个 Promise 对象
4. try-catch 截获 Promise 中 reject 的值



使用 koa-generator

```js
// npm i -g koa-generator
// Koa2 blog-express
// cd blog-express
// npm i
// npm start
// http://localhost:3000/
```



