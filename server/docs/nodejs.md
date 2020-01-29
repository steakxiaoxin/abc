## 1. Nodejs 介绍

### 1-1.下载和安装

#### 使用 nvm 管理 node 版本

install $ update script：

`curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.34.0/install.sh | bash`

输入 `nvm --version`，如果出现 zsh: command not found: nvm 。是因为本地安装了 oh my zsh，只需在 ~/.zshrc 中添加配置 

```json
export NVM_DIR="/Users/xiaoxin/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion
```

`nvm --version` 0.34.0

卸载之前的node，`nvm install v10.15.3` 安装 node 不同的版本，`nvm list` 看安装了哪些 node版本，`nvm use <version>` 使用某个版本



### 1-2.Nodejs 和 js 的区别

#### ECMAScript 是语法规范

- 定义了语法，写 JavaScript 和 nodejs 都必须遵守
- 变量定义、循环、判断、函数
- 原型和原型链、作用域和闭包、异步

#### JavaScript = ECMAScript + web api

- 使用了 ECMAScript 语法规范，外加 Web API（W3C标准），缺一不可
- Web API 包括：dom 操作，bom 操作，事件绑定，ajax 等
- 两者结合，即可完成浏览器端的任何操作

#### Nodejs = ECMAScript + node API

- 使用了 ECMAScript 语法规范，外加 nodejs API，缺一不可
- nodejs API 包括：处理 http，处理文件，具体参考 [nodejs文档](<http://nodejs.cn/api/>)
- 两者结合，即可完成 sever 端的任何操作



### 1-3.commonjs 和 debugger

#### Commonjs 模块化

```js
// 导出
module.exports = xx
module.exports = { aa, bb }

// 引用
const xx = require('path')
const { aa, bb } = require('path')
```



#### 使用 vscode debugger

- 侧边栏小虫
- 代码左侧打红色断点
- 左上角调试



### 1-4. Server 开发和前端开发的区别

*重点在于思路切换*

#### 服务稳定性

- sever 端可能会遭受各种恶意攻击和误操作
- 单个客户端可以意外挂掉，但是服务端不能

使用 PM2 做进程守候（挂掉后会自动重启）



#### 考虑内存和 CPU（优化，扩展）

- 客户端独占一个浏览器，内存和 CPU 都不是问题
- sever 端要承载很多请求，CPU 和内存都是稀缺资源
- 使用stream 写日志，使用 Redis 存 session



#### 日志记录

- 前端也会参与写日志，但只是日志的发起方，不关心后续
- server 端要记录日志，存储日志，分析日志，前端不关心
- 多种日志记录方式，分析日志



#### 安全

- server 端要随时准备接收各种恶意攻击，前端则少很多
- 如：越权操作，数据库攻击等
- 登录验证，预防 xss 攻击 和 sql 注入



#### 集群和服务拆分

- 产品发展速度快，流量可能会迅速增加
- 如何通过扩展机器和服务拆分来承载大流量



## 2. 开发博客项目之接口

### 2-1. http-请求概述

> http：HyperText Transfer Protocol，超文本传输协议。http默认端口80，https默认请求端口443

**从输入URL到显示页面的整个过程是什么？**

1. 客户端：DNS 解析查询 IP、建立 TCP 连接（三次握手）、发送 http 请求
2. server 端：接收到 http 请求，处理，并返回
3. 客户端：接收到返回数据，处理数据（如渲染页面，执行 js）

![输入URL.png](https://i.loli.net/2019/06/02/5cf39ec0bb85a55347.png) 



### 2-2. nodejs 处理 http 请求

```js
// 简单示例
const http = require("http");

const server = http.createServer((req, res) => {
  res.end("<h1>hello world</h1>");
});
server.listen(3000);
// 然后浏览器访问 http://localhost:3000/
```



#### nodejs 处理 get 请求

- get 请求，即客户端要向 server 端获取数据，如查询博客列表
- 通过 querystring 来传递数据，如 a.htmml?a=100&b=200
- 浏览器直接访问，就发送 get 请求

```js
const http = require("http");
const querystring = require("querystring"); // 相当于浏览器 location.search

const server = http.createServer((req, res) => {
  console.log(req.method); // GET
  const url = req.url; // 获取请求的完整 URL
  req.query = querystring.parse(url.split("?")[1]); // 解析 querystring
  res.end(JSON.stringify(req.query)); // 将 querystring 返回
});
server.listen(3000, () => {
  console.log("ok --- server listen in 3000");
});
// 然后浏览器访问 http://localhost:3000/?a=1&b=2
```



#### nodejs 处理 post 请求

- post 请求，即客户端要像服务端传递数据，如新建博客
- 通过 post 的 data 传递数据
- 浏览器无法直接模拟，需要手写 js，或者使用 postman

```js
const http = require("http");

const server = http.createServer((req, res) => {
  // !!! req.method 是 大写
  if (req.method === "POST") {
    // 数据格式
    console.log("content-type", req.headers["content-type"]);
    // 接收数据
    let postData = "";
    req.on("data", chunk => {
      postData += chunk.toString();
    });
    req.on("end", () => {
      console.log(postData);
      res.end("hello world"); // 在这里返回，因为是异步
    });
  }
});
server.listen(3000, () => {
  console.log("ok --- server listen in 3000");
});

// 然后 postman send http://localhost:3000
```



#### nodejs 处理路由

```js
const http = require("http");

const server = http.createServer((req, res) => {
  const url = req.url; // 获取请求的完整 URL
  const path = url.split("?")[0];
  res.end(path); // 返回路由
});
server.listen(3000, () => {
  console.log("ok --- server listen in 3000");
});
// 然后浏览器访问 http://localhost:3000/aa/bb
```



#### 综合实例

```js
const http = require("http");
const querystring = require("querystring"); // 相当于浏览器 location.search

const server = http.createServer((req, res) => {
  const method = req.method;
  const url = req.url;
  const path = url.split("?")[0];
  const query = querystring.parse(url.split("?")[1]);

  // 设置返回格式为 JSON
  res.setHeader("Content-type", "application/json");

  // 返回的数据
  const resData = {
    method,
    url,
    path,
    query
  };

  // 返回
  if (method === "GET") {
    res.end(JSON.stringify(resData));
  } else if (method === "POST") {
    let postData = "";
    req.on("data", chunk => {
      postData += chunk.toString();
    });
    req.on("end", () => {
      resData.postData = postData;
      res.end(JSON.stringify(resData));
    });
  }
});
server.listen(3000, () => {
  console.log("ok --- server listen in 3000");
});
```



## 3. 搭建开发环境

> 从 0 开始搭建，不使用任何框架
>
> 使用 nodemon 检测文件变化，自动重启node
>
> 使用 cross-env 设置环境变量，兼容 mac Linux 和 Windows



### 3-1. 初始化目录

安装 `npm i -D nodemon cross-env`

```js
目录结构：
├── app.js
├── bin
│   └── www.js
└── package.json

// /bin/www.js
const http = require("http");
const PORT = 3000;
const serverHandle = require("../app");
const server = http.createServer(serverHandle);
server.listen(PORT, () => {
  console.log("listen" + PORT + "...");
});

// /app.js
const serverHandle = (req, res) => {
  res.setHeader("Content-type", "application/json");
  const resData = {
    name: "小新100",
    site: "MacBook",
    env: process.env.NODE_ENV
  };
	res.end(JSON.stringify(resData));
};

module.exports = serverHandle;

// package.json
{
  "name": "blog-1",
  "version": "1.0.0",
  "main": "bin/www.js",
  "scripts": {
    "dev": "cross-env NODE_ENV=dev nodemon ./bin/www.js"
  },
  "devDependencies": {
    "cross-env": "^5.2.0",
    "nodemon": "^1.19.1"
  }
}
```



### 3.2 初始化路由

![JIEKOU.png](https://i.loli.net/2019/06/04/5cf67a35bece669382.png)

```JS
目录结构：
├── app.js
├── bin
│   └── www.js
├── controler
│   ├── blog.js
│   └── user.js
├── model
│   └── resModel.js
├── package.json
└── src
    └── router
        ├── blog.js
        └── user.js


// /src/router/blog.js
const handleBlogRouter = (req, res) => {
  const method = req.method;

  // 获取博客列表
  if (method === "GET" && req.path === "/api/blog/list") {
    return { msg: "获取博客列表" };
  }

  // 获取博客内容
  if (method === "GET" && req.path === "/api/blog/detail") {
    return { msg: "获取博客内容" };
  }

  // 新建博客
  if (method === "POST" && req.path === "/api/blog/new") {
    return { msg: "新建博客" };
  }

  // 更新博客
  if (method === "POST" && req.path === "/api/blog/update") {
    return { msg: "更新博客" };
  }

  // 删除博客
  if (method === "POST" && req.path === "/api/blog/delete") {
    return { msg: "删除博客" };
  }
};
module.exports = handleBlogRouter


// src/router/user.js
const handleUserRouter = (req, res) => {
  const method = req.method;

  // 登录
  if (method === "POST" && req.path === "/api/user/login") {
    return { msg: "登录" };
  }
};
module.exports = handleUserRouter;


// /app.js
// process.env.NODE_ENV
const handleBlogRouter = require("./src/router/blog");
const handleUserRouter = require("./src/router/user");

const serverHandle = (req, res) => {
  // 设置返回格式 json
  res.setHeader("Content-type", "application/json");

  const url = req.url;
  req.path = url.split("?")[0];

  // 处理 blog 路由
  const blogData = handleBlogRouter(req, res);

  // 处理 user 路由
  const userData = handleUserRouter(req, res);

  if (blogData) {
    res.end(JSON.stringify(blogData));
    return;
  }
  if (userData) {
    res.end(JSON.stringify(userData));
    return;
  }
  res.writeHead(404, { "Content-type": "text/plain" });
  res.write("404 NotFound");
  res.end();
};

module.exports = serverHandle;
```



### 3.3 开发路由

```js
目录结构
├── app.js
├── bin
│   └── www.js
├── controler
│   └── blog.js
├── model
│   └── resModel.js
├── package.json
└── src
    └── router
        ├── blog.js
        └── user.js

// /app.js
// process.env.NODE_ENV

const querystring = require("querystring");
const handleBlogRouter = require("./src/router/blog");
const handleUserRouter = require("./src/router/user");

// 用于处理 post data
const getPostData = req => {
  return new Promise((resolve, reject) => {
    if (req.method !== "POST") {
      resolve({});
      return;
    }
    if (req.headers["content-type"] !== "application/json") {
      resolve({});
      return;
    }
    let postData = "";
    req.on("data", chunk => {
      postData += chunk.toString();
    });
    req.on("end", () => {
      if (!postData) {
        resolve({});
        return;
      }
      resolve(JSON.parse(postData));
    });
  });
};

const serverHandle = (req, res) => {
  // 设置返回格式 json
  res.setHeader("Content-type", "application/json");

  const url = req.url;
  req.path = url.split("?")[0];
  req.query = querystring.parse(url.split("?")[1]);

  getPostData(req).then(postData => {
    req.body = postData;

    // 处理 blog 路由
    const blogData = handleBlogRouter(req, res);

    // 处理 user 路由
    const userData = handleUserRouter(req, res);

    if (blogData) {
      res.end(JSON.stringify(blogData));
      return;
    }
    if (userData) {
      res.end(JSON.stringify(userData));
      return;
    }
    res.writeHead(404, { "Content-type": "text/plain" });
    res.write("404 NotFound");
    res.end();
  });
};

module.exports = serverHandle;



// /model/resModel.js
class BaseModel {
  constructor(data, msg) {
    if (typeof data === "string") {
      this.msg = data;
      data = null;
      msg = null;
    }
    if (data) {
      this.data = data;
    }
    if (msg) {
      this.msg = msg;
    }
  }
}

class SuccessModel extends BaseModel {
  constructor(data, msg) {
    super(data, msg);
    this.errno = 0;
  }
}

class ErrorModel extends BaseModel {
  constructor(data, msg) {
    super(data, msg);
    this.errno = 1;
  }
}

const successData = (...props) => {
  return new SuccessModel(...props)
}

const errorData = (...props) => {
  return new ErrorModel(...props)
}

module.exports = {
  successData,
  errorData
};


// /controler/blog.js
const blogControler = {
  getList: (author, keyword) => {
    return [
      {
        id: 1,
        title: "标题1",
        content: "内容1",
        createTime: 1559709863152,
        author: "张三"
      },
      {
        id: 2,
        title: "标题2",
        content: "内容2",
        createTime: 1559709863152,
        author: "李四"
      }
    ];
  },

  getDetail: id => {
    return {
      id: 1,
      title: "标题1",
      content: "内容1",
      createTime: 1559709863152,
      author: "张三"
    };
  },

  newBlog: (blogData = {}) => {
    return {
      id: 6
    };
  },

  updateBlog: (id, blogData = {}) => {
    return true;
  },

  delBlog: id => {
    return true;
  }
};

module.exports = blogControler;


// /controler/user.js
const userControler = {
  login: (username, password) => {
    return username === "kobe" && password === "123";
  }
};

module.exports = userControler;


// /src/router/blog.js
const {
  getList,
  getDetail,
  newBlog,
  updateBlog,
  delBlog
} = require("../../controler/blog");
const { successData, errorData } = require("../../model/resModel");

const handleBlogRouter = (req, res) => {
  const method = req.method;
  const id = req.query.id || "";

  // 获取博客列表
  if (method === "GET" && req.path === "/api/blog/list") {
    const author = req.query.author || "";
    const keyword = req.query.keyword || "";
    const blogList = getList(author, keyword);
    return successData(blogList, "blogList");
  }

  // 获取博客内容
  if (method === "GET" && req.path === "/api/blog/detail") {
    const blogDetail = getDetail(id);
    return successData(blogDetail, "blogDetail");
  }

  // 新建博客
  if (method === "POST" && req.path === "/api/blog/new") {
    const blogData = req.body;
    const data = newBlog(blogData);
    return successData(data, "newBlog");
  }

  // 更新博客
  if (method === "POST" && req.path === "/api/blog/update") {
    const blogData = req.body;
    const result = updateBlog(id, blogData);
    return result ? successData() : errorData("更新失败");
  }

  // 删除博客
  if (method === "POST" && req.path === "/api/blog/delete") {
    const result = delBlog(id);
    return result ? successData() : errorData("删除失败");
  }
};

module.exports = handleBlogRouter;


// /src/router/user.js
const { login } = require("../../controler/user");
const { successData, errorData } = require("../../model/resModel");

const handleUserRouter = (req, res) => {
  const method = req.method;

  // 登录
  if (method === "POST" && req.path === "/api/user/login") {
    const { username, password } = req.body;
    const result = login(username, password);
    return result ? successData() : errorData("登录失败");
  }
};

module.exports = handleUserRouter;
```





## 4. Mysql

[Mysql下载](<https://dev.mysql.com/downloads/mysql/>) 

[Workbench下载](<https://dev.mysql.com/downloads/workbench/>) 

安装用户名是 root，密码 8 位。



### 4-1.操作数据库

- #### 建库

  - 创建 myblog 数据库
  - 执行 show databases; 查询

- #### 建表

  - Tables -- Create Table...
  - 修改表 -- Alter Table...
  - 删表 -- Drop Table...

- #### 表操作

  ```mysql
  use myblog;
  
  -- show tables;
  
  -- insert into users (username,`password`,realname) values ('zhangsan','123','张三');
  
  -- select * from users;
  -- select id,username from users;
  -- select * from users where username='zhangsan' and `password`='123';
  -- select * from users where username='zhangsan' or `password`='123';
  -- select * from users where username like '%zhang%';
  -- select * from users where password like '%1%';
  -- select * from users where password like '%1%' order by id desc;
  
  -- SET SQL_SAFE_UPDATES = 0
  
  -- update users set realname='李四2', password='123' where username='lisi';
  
  
  -- delete from users where username='lisi';
  
  
  -- select * from users where state='1';
  -- select * from users where state<>'0';
  -- update users set state='0' where username='lisi'; -- 软删除
  
  -- insert into blogs (title,content,createtime,author) values ('标题c','内容c',1559880383753,'李四c');
  
  -- select * from blogs where title like '%标题%' order by createtime desc;
  ```



### 4-2. Nodejs 操作数据库

`npm i mysql`

```js
// mysql demo
const mysql = require("mysql");

// 创建连接对象
const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "12345678",
  port: "3306",
  database: "myblog"
});

// 开始连接
con.connect();

// 执行 sql 语句
const sql = "select * from users;";
con.query(sql, (err, result) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log(result);
});

// 关闭连接
con.end();
```

执行如遇报错：

```js
...
code: 'ER_NOT_SUPPORTED_AUTH_MODE',
  errno: 1251,
  sqlMessage:
   'Client does not support authentication protocol requested by server; consider upgrading MySQL client',
  sqlState: '08004',
  fatal: true }
```

可在 workbench 输入以下 sql 逐条运行

```mysql
use myblog;

ALTER USER 'root'@'localhost'IDENTIFIED WITH mysql_native_password BY '12345678';

FLUSH PRIVILEGES;
```



### 4-3. API 对接 MySQL

```js
目录结构
├── app.js
├── bin
│   └── www.js
├── conf
│   └── db.js
├── controler
│   ├── blog.js
│   └── user.js
├── db
│   └── mysql.js
├── model
│   └── resModel.js
├── package.json
└── src
    └── router
        ├── blog.js
        └── user.js

// 添加 db 配置文件
// /conf/db.js
const env = process.env.NODE_ENV;

const MYSQL_CONF = {
  env: {
    host: "localhost",
    user: "root",
    password: "12345678",
    port: "3306",
    database: "myblog"
  },
  production: {
    host: "localhost",
    user: "root",
    password: "12345678",
    port: "3306",
    database: "myblog"
  }
}[env];

module.exports = {
  MYSQL_CONF
};


// 添加 MySQL 
// /db/mysql.js
const mysql = require("mysql");
const { MYSQL_CONF } = require("../conf/db");

// 创建链接对象
const con = mysql.createConnection(MYSQL_CONF);

// 创建链接
con.connect();

const exec = sql => {
  return new Promise((resolve, reject) => {
    con.query(sql, (err, result) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(result);
    });
  });
};

// 保持链接状态 不用写 con.end() 断开链接

module.exports = { exec };

```





## 5. 登录

### 5-1. cookie

- **什么是 cookie？**
  - 存储在浏览器的一段字符串( 最大 5kb )
  - 跨域不共享
  - 格式如 k1=v1; ke=v2; k3=v3; 因此可以存储结构化数据
  - 每次发送 HTTP 请求，会将请求域(请求的server方)的 cookie 一起发送给 server
  - server 可以修改 cookie 并返回给浏览器
  - 浏览器中也可以通过 JavaScript 修改 cookie (有限制 httpOnly)



- **JavaScript 操作 cookie，浏览器中查看 cookie**
  - 客户端查看 cookie，三种方式
    - 请求头 Request Headers 中的 Cookie；Response Headers 中 Set-Cookie 看
    - application 中的 cookies
    - 控制台 document.cookie
  - JavaScript 查看、修改 cookie(有限制 httpOnly)
    - 执行 document.cookie = 'k1=v1' 可累加 cookie



- **server 端操作 cookie，实现登录验证**
  - 查看 cookie --- `req.headers.cookie`

    ```js
    req.cookie = {};
    const cookieStr = req.headers.cookie || "";
    cookieStr.split(";").forEach(item => {
      if (!item) {
        return;
      }
      const arr = item.split("=");
      req.cookie[arr[0].trim()] = arr[1].trim();
    });
    ```

  - 修改 cookie

    ```js
    // 获取 cookie 的过期时间
    const getCookieExpires = () => {
      const d = new Date();
      d.setTime(d.getTime() + 5 * 1000);
      return d.toGMTString();
    };
    
    
    res.setHeader("Set-Cookie", `username=${username}; path=/; httpOnly; expires=${getCookieExpires()}`);
    // httpOnly 只允许服务端修改，不允许前端修改 cookie
    // expires 设置 cookie 的过期时间，否则一直有效
    ```

  - 实现登录验证



### 5-2. session

仅用 cookie 存储用户信息会暴露 username，很危险。解决办法，cookie 中存储 userid，server 端对应 username

session 是一个通称，登录或是存储会话信息的通称，通过 cookie 传递的 sessionID 来对应 server 端存储的用户信息。

```js
// session 数据
const SESSION_DATA = {};
...

// 解析 session
let needSetCookie = false;
let userId = req.cookie.userid;
if (userId) {
  if (!SESSION_DATA[userId]) {
    SESSION_DATA[userId] = {};
  }
} else {
  needSetCookie = true;
  userId = `${Date.now()}_${Math.random()}`;
  SESSION_DATA[userId] = {};
}
req.session = SESSION_DATA[userId];
```



### 5-3. redis

**session 存在的问题：如果 session 是 js 变量，放在 nodejs 进程内存中**

1. 进程内存有限，访问量过大，内存暴增怎么办？(nodejs 在32位系统中1.6g内存限制，64位系统中不超过3g限制)
2. 正式线上运行的是多进程，进程之间内存无法共享，session 不通

#### 解决方案：Redis

- web server 最常用的缓存数据库，数据存放在内存中，读写快
- 想比于 MySQL，访问速度快( 内存和硬盘不是一个数量级的 )
- 成本高，可存储的数据量小(内存的硬伤)
- 将 web server 和 redis 拆分成两个单独的服务
- 双方都是独立的，都是可扩展的( 例如都扩展成集群，包括MySQL )

**将 session 放在 Redis 中 / 网站不放的原因**

- session 访问频繁，对性能要求极高；网站数据操作评率不是太高
- session 可不考虑断电丢失数据的问题；网站数据断电不能丢失，必须保留
- session 数据量不会太大 ( 想比于 MySQL 中存储的数据 )；网站数据量太大，内存成本太高



### 5-4. 和前端联调 (Nginx)

- 登录功能依赖 cookie，必须用浏览器来联调
- cookie 跨域不共享，前端和server端必须同域 (例如前端地址 localhost: 8001/index.html 接口地址 localhost: 8000/api/blog/list 跨域)
- 需要用到 Nginx 做代理，让前后端同域

#### Nginx

- 高性能的 web 服务器，开源免费
- 一般用于做静态服务、负载均衡
- 反向代理

![反向代理.png](https://i.loli.net/2019/06/10/5cfe6c0fb592e29708.png)

1. 下载： `brew install nginx`
2. 配置文件：`sudo vi /usr/local/etc/nginx/nginx.conf`
3. 命令
   - 测试配置文件格式是否正确 nginx -t

   - 启动 nginx

   - 重启 nginx -s reload

   - 停止 nginx -s stop

     获取 Nginx 进程号 ps -ef|grep nginx

     kill -QUIT  15800 (从容的停止，即不会立刻停止)

     Kill -TERM  15800 （立刻停止）

     Kill -INT  15800  （和上面一样，也是立刻停止）





## 6. 日志

### 6-1. Nodejs 文件操作

日志可分为：

1. 访问日志 access log ( server 端最重要的日志 )
2. 自定义日志 ( 包括自定义事件、错误记录等 )

```js
// 文件读写
const fs = require("fs");
const path = require("path");

const fileName = path.resolve(__dirname, "data.txt");

// 读取文件内容
fs.readFile(fileName, (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  // data 是二进制内容，需要转换为字符串
  console.log(data.toString());
});

// 写入文件
const content = "this is new content\n";
const opt = {
  flag: "a" // 追加写入。覆盖用 'w'
};
fs.writeFile(fileName, content, opt, err => {
  if (err) {
    console.error(err);
  }
});

// 判断文件是否存在
fs.exists(fileName, exist => {
  console.log("exist: ", exist);
});
```



### 6-2. stream 

**IO 操作的性能瓶颈**

- io 包括 网络io 和 文件io
- 相比于 CPU 计算和内存读写，io 的突出特点就是：慢！
- 如何在有限的硬件资源下提高 io 的操作效率 --- **stream**

简单代码演示：

```js
// 标准的输入输出，pipe 就是管道(符合水流管道的模型)
// process.stdin 获取数据，直接通过管道传递给 process.stdout
process.stdin.pipe(process.stdout)
```

```js
// post 输入输出
const http = require("http");
const server = http.createServer((req, res) => {
  if (req.method === "POST") {
    res.setHeader("Content-type", "application/json");
    req.pipe(res);  // 最主要
  }
});
server.listen(8000);
```

```js
// 复制文件
const fs = require("fs");
const path = require("path");

const fileName1 = path.resolve(__dirname, "data.txt");
const fileName2 = path.resolve(__dirname, "data-bak.txt");

const readStream = fs.createReadStream(fileName1);
const writeStream = fs.createWriteStream(fileName2);

readStream.pipe(writeStream);
readStream.on("data", chunk => {
  console.log(chunk.toString());
});
readStream.on("end", () => {
  console.log("copy done");
});
```

```js
// 网络异步获取文件
const http = require("http");
const fs = require("fs");
const path = require("path");
const fileName1 = path.resolve(__dirname, "data.txt");
const server = http.createServer((req, res) => {
  if (req.method === "GET") {
    const readStream = fs.createReadStream(fileName1);
    readStream.pipe(res);
  }
});
server.listen(8000);
```



### 6-3. 写日志

```js
// utils/log.js
const fs = require("fs");
const path = require("path");

// 写日志
const writeLog = (writeStream, log) => {
  writeStream.write(log + "\n"); // 关键代码
};

// 生成 write stream
const createWriteSteam = fileName => {
  const fullFileName = path.join(__dirname, "../", "logs/", fileName);
  const writeStream = fs.createWriteStream(fullFileName, {
    flags: "a"
  });
  return writeStream;
};

// 写访问日志
const accessWriteStream = createWriteSteam("access.log");
const access = log => {
  writeLog(accessWriteStream, log);
};

module.exports = {
  access
};


// app.js
const { access } = require("./utils/log");

...
const serverHandle = (req, res) => {
  // 记录 access log
  access(`${req.method} -- ${req.url} -- ${req.headers['user-agent']} -- ${Date.now()}`)
    ...
}
  
```



### 6-4. 日志拆分

- 日志内容会慢慢积累，放在一个文件中不好处理
- 按时间划分日志文件，如 2019-06-11.access.log
- 实现方式：Linux 的 crontab 命令，即定时任务

**crontab**

- 设置定时任务，格式： * * * * * command
- 将 access.log 拷贝并重命名为 2019-06-11.access.log
- 清空 access.log 文件，继续积累日志

使用 shell 脚本拆分日志

```sh
#!/bin/sh
cd /Users/xiaoxin/xiaoxin/download/demo/webpackPlus/node/codes/mine/code-demo/blog-1/logs
cp access.log $(date +%Y-%m-%d).access.log
echo "" > access.log
```

运行 `sh copy.sh`



### 6-5. 日志分析

- 如针对 access.log 日志，分析 Chrome 的占比
- 日志是按行存储的，一行就是一条日志
- 使用 nodejs 的 readline ( 基于 stream，效率高 )

```js
// utils/readline.js
const fs = require("fs");
const path = require("path");
const readline = require("readline");

// 文件名
const fileName = path.join(__dirname, "../", "logs", "access.log");
// 创建 read stream
const readStream = fs.createReadStream(fileName);

// 创建 readline 对象
const rl = readline.createInterface({
  input: readStream
});

let chromeNum = 0;
let total = 0;

// 逐行读取
rl.on("line", lineData => {
  if (!lineData) {
    return;
  }
  // 记录总行数
  total++;
  const arr = lineData.split("--");
  if (arr[2] && arr[2].includes("Chrome")) {
    chromeNum++;
  }
});
// 监听读取完成
rl.on("close", () => {
  console.log("chrome 占比", chromeNum / total);
});
```



## 7. 安全

### 7-1. SQL 注入

- 最原始、最简单的攻击，从有了 web2.0 就有了SQL注入攻击
- 攻击方式：输入一个SQL片段，最终拼接成一段攻击代码
- 预防措施：使用MySQL的escape函数处理输入内容即可

```js
const mysql = require("mysql");
mysql.escape(xxx)
```



### 7-2. XSS 攻击

- `<script> alert('xss') </script>`

- 攻击方式：在页面沾水内容中掺杂 js 代码，以获取网页信息
- 预防措施：转义生成 js 的特殊字符 。< : &lt



### 7-3. 密码加密

- 万一数据库被用户攻破，最不应该泄露的就是用户信息
- 攻击方式：获取用户名和密码，再去尝试登录其他系统
- 预防措施：将密码加密，即便拿到密码也不知道明文

```js
// utils/crypt.js
const crypto = require("crypto");

// 密匙
const SECRET_KEY = "WEEW1+D&";

// md5 加密
function md5(content) {
  let md5 = crypto.createHash("md5");
  return md5.update(content).digest("hex");
}

// 加密函数
function genPassword(password) {
  const str = `password=${password}&key=${SECRET_KEY}`;
  return md5(str);
}

module.exports = {
  genPassword
};
```



## 8. 总结

- http，nodejs 处理 http、处理路由、MySQL
- cookie、session、redis、Nginx 反向代理
- SQL注入、xss 攻击、加密
- 日志、stream、contrab、readline

![屏幕快照 2019-06-13 21.00.13.png](https://i.loli.net/2019/06/13/5d024987dbd7655930.png)