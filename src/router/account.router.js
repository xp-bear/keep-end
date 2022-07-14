const Router = require("koa-router");

const { create, untilTen, addComment } = require("../controller/account.controller");

// 前缀
const accountRouter = new Router({
  prefix: "/account",
});

// 控制器函数
accountRouter.get("/", create);
accountRouter.get("/everyday", untilTen);

accountRouter.post("/add", addComment); //添加数据

module.exports = accountRouter;
