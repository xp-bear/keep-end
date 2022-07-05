const Router = require("koa-router");

const { create } = require("../controller/account.controller");

// 前缀
const accountRouter = new Router({
  prefix: "/account",
});

// 控制器函数
accountRouter.get("/", create);

module.exports = accountRouter;
