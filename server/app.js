const koa = require("koa");
const app = new koa();

app.use(async (ctx, next) => {
  ctx.body = 1;
  await next();
});

app.listen(3001);
console.log("app is run on http://localhost:3001");
