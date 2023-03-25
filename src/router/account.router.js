const Router = require("koa-router");

const { deleteComment, searchDay, addComment, searchMonth } = require("../controller/account.controller");

// 前缀
const accountRouter = new Router({
  prefix: "/account",
});

// 控制器函数
accountRouter.get("/searchday", searchDay); //按日期查询
accountRouter.get("/searchmonth", searchMonth); //按月份查询

accountRouter.post("/add", addComment); //添加数据

accountRouter.post("/delete", deleteComment); //添加数据

module.exports = accountRouter;
