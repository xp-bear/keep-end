const Koa = require("koa");

const errorHandler = require("./error-handler");
const accountRouter = require("../router/account.router");
const { allowedMethods } = require("../router/account.router");

const app = new Koa();

// 挂载路由
app.use(accountRouter.routes());

// 挂载错误处理中间件
app.on("error", errorHandler);

module.exports = app;
