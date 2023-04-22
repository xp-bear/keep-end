const Router = require("koa-router");
const { login, register } = require("../controller/user.controller");

// 前缀
const userRouter = new Router({
  prefix: "/user",
});

// 控制器函数
userRouter.post("/login", login); //按日期查询
userRouter.post("/register", register); //按日期查询

module.exports = userRouter;
