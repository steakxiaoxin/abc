# Node API

## crypto(加密)

1. crypto 模块
   1. `crypto.createHash("md5")` 生成指定算法的 hash 类
2. Hash 类
   1. `hash.digest("hex")` 计算所有需要被哈希化的数据摘要 
   2. `hash.update(data)` 根据 `data`更新hash的内容



## fs(文件系统)

1. `fs.readFile(path, options, callback)` 异步地读取文件的全部内容
2. `fs.writeFile(file, data, options, callback)` 异步地将数据写入到一个文件，如果文件已存在则覆盖该文件
3. `fs.exists(path, callback)` 通过检查文件系统来测试给定的路径是否存在。废弃





## HTTP

1. `http.createServer()` 返回新建的 http.Server 实例



### http.Server 类

1. `server.listen()` 启动 HTTP 服务器监听连接
2. 'request' 事件, 每次有请求时都会触发 `(req, res)=>{}`



### http.IncomingMessage 类

1. message.method , 请求方法为字符串。 只读。 示例：`'GET'`、 `'DELETE'`。
2. message.url ,  请求的 URL 字符串

### http.ServerResponse 类

1. `response.end()` 此方法向服务器发出信号，表明已发送所有响应头和主体，该服务器应该视为此消息已完成。 必须在每个响应上调用此方法。
2. `response.setHeader(name, value)` 为隐式响应头设置单个响应头的值
3. `response.writeHead(statusCode, statusMessage?, headers?)` 向请求发送响应头
4. `response.write()` 发送一块响应主体



## module(模块)

- ### 模块作用域

  1. `__dirname` 当前模块的目录名 `=== path.dirname(__filename) `
  2. `__filename` 当前的模块文件的绝对路径
  3. `require()` 用于引入模块、 `JSON`、或本地文件

- ### module 对象

  1. `module.exports` 
  2. `exports` 快捷方式



## path(路径)

1. `path.resolve([...paths])` 将路径或路径片段的序列解析为绝对路径
2. `path.dirname(__filename) === __dirname` 返回 `path` 的目录名



## process (进程)

1. `process.env` 属性返回包含用户环境的对象。`process.env.NODE_ENV` 获取当前运行环境





## querystring(查询字符串)

1. `querystring.parse()` 将 URL 查询字符串 `str` 解析为键值对的集合



## readline(逐行读取)

1. readline.Interface 类 ，使用 `readline.createInterface()` 方法构造
   1. close 事件，`readline.Interface` 实例完成时触发
   2. line 事件，当 `input` 流接收到行尾输入（`\n`、 `\r` 或 `\r\n`）时触发
2. 



## stream(流)

1. stream.Readable 类
   1. 'data' 事件, 当流将数据块传送给消费者后触发
   2. 'end' 事件, 只有在数据被完全消费掉后才会触发
2. stream.writable 类
   1. `writable.write(chunk, encoding, callback)` 写入数据到流，并在数据被完全处理之后调用 `callback`
3. 