# express

express 是 nodejs 最常用的 web sever 框架

使用 express-generator

```js
// npm i -g express-generator
// express blog-express
// cd blog-express
// npm i
// npm start
// http://localhost:3000/
```



### express 中间件

```js
// 是一个函数
const mid = (req, res, next) => {
  console.log("中间件");
  next();
};
```

```js
// 依次执行 app.use(中间件函数)，函数中执行 next()，会执行下一个 app.use；
// 如果请求是 GET，会执行 app.get，同理 POST；
// 如果请求路由是 /api 开头，会执行 app.[user / get / post]('/api', func)；
// app.use 可放多个中间件函数

const express = require("express");

// 本次 http 请求的实例
const app = express();

app.use((req, res, next) => {
  console.log("请求开始...", req.method, req.url);
  next();
});

app.use((req, res, next) => {
  // 假设在处理 cookie
  req.cookie = {
    userId: "abc123"
  };
  next();
});

app.use((req, res, next) => {
  // 假设处理 post data
  // 异步
  setTimeout(() => {
    req.body = {
      a: 100,
      b: 200
    };
    next();
  });
});

app.use("/api", (req, res, next) => {
  console.log("处理 /api 路由");
  next();
});

app.get("/api", (req, res, next) => {
  console.log("get /api 路由");
  next();
});
app.post("/api", (req, res, next) => {
  console.log("post /api 路由");
  next();
});

// 模拟登录验证
function loginCheck(req, res, next) {
  setTimeout(() => {
    console.log("模拟登陆失败");
    res.json({
      errno: -1,
      msg: "登录失败"
    });

    // console.log('模拟登陆成功')
    // next()
  });
}

app.get("/api/get-cookie", loginCheck, (req, res, next) => {
  console.log("get /api/get-cookie");
  res.json({
    errno: 0,
    data: req.cookie
  });
});

app.post("/api/get-post-data", loginCheck, (req, res, next) => {
  console.log("post /api/get-post-data");
  res.json({
    errno: 0,
    data: req.body
  });
});

app.use((req, res, next) => {
  console.log("处理 404");
  res.json({
    errno: -1,
    msg: "404 not fount"
  });
});

app.listen(3000, () => {
  console.log("server is running on port 3000");
});

```



#### 中间件原理分析

- app.use 用来注册中间件，先收集起来
- 遇到 http 请求，根据 path 和 method 判断触发哪些
- 实现 next 机制，即上一个通过 next 触发下一个

```js
const http = require("http");
const slice = Array.prototype.slice;

class LikeExpress {
  constructor() {
    // 存放中间件的列表
    this.routes = {
      all: [], // app.use(...)
      get: [], // app.get(...)
      post: [] // app.post(...)
    };
  }

  register(path) {
    const info = {};
    if (typeof path === "string") {
      info.path = path;
      // 从第二个参数开始，转换为数组，存入 stack
      info.stack = slice.call(arguments, 1);
    } else {
      info.path = "/";
      // 从第一个参数开始，转换为数组，存入 stack
      info.stack = slice.call(arguments, 0);
    }
    return info;
  }

  use() {
    const info = this.register.apply(this, arguments);
    this.routes.all.push(info);
  }

  get() {
    const info = this.register.apply(this, arguments);
    this.routes.get.push(info);
  }

  post() {
    const info = this.register.apply(this, arguments);
    this.routes.post.push(info);
  }

  match(method, url) {
    let stack = [];
    if (url === "/favicon.ico") {
      return stack;
    }

    // 获取 routes
    let curRoutes = [];
    curRoutes = curRoutes.concat(this.routes.all);
    curRoutes = curRoutes.concat(this.routes[method]);

    curRoutes.forEach(routeInfo => {
      if (url.indexOf(routeInfo.path) === 0) {
        // url === '/api/get-cookie' 且 routeInfo.path === '/'
        // url === '/api/get-cookie' 且 routeInfo.path === '/api'
        // url === '/api/get-cookie' 且 routeInfo.path === '/api/get-cookie'
        stack = stack.concat(routeInfo.stack);
      }
    });
    return stack;
  }

  // 核心的 next 机制
  handle(req, res, stack) {
    const next = () => {
      // 拿到第一个匹配的中间件
      const middleware = stack.shift();
      if (middleware) {
        // 执行中间件函数
        middleware(req, res, next);
      }
    };
    next();
  }

  callback() {
    return (req, res) => {
      res.json = data => {
        res.setHeader("Content-type", "application/json");
        res.end(JSON.stringify(data));
      };
      const url = req.url;
      const method = req.method.toLowerCase();

      const resultList = this.match(method, url);
      this.handle(req, res, resultList);
    };
  }

  listen(...args) {
    const server = http.createServer(this.callback());
    server.listen(...args);
  }
}

// 工厂函数
module.exports = () => {
  return new LikeExpress();
};
```

