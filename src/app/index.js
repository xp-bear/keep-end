const Koa = require("koa");
const cors = require("@koa/cors");
const koaBody = require("koa-body");

const errorHandler = require("./error-handler");
const accountRouter = require("../router/account.router");
// const { allowedMethods } = require("../router/account.router");

const app = new Koa();
app.use(cors());
app.use(koaBody());
// 挂载路由
app.use(accountRouter.routes());

// 挂载错误处理中间件
app.on("error", errorHandler);

module.exports = app;
