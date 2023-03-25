const Router = require("koa-router");

const indexRouter = new Router();
// 控制器函数
indexRouter.get("/", async (ctx, next) => {
  ctx.body = "后端服务启动成功";
  await next();
});
module.exports = indexRouter;
