const Router = require("koa-router");

const { updateData, searchYear, searchTotalDay, searchUser, searchPie, deleteComment, searchDay, addComment, searchMonth } = require("../controller/account.controller");

// 前缀
const accountRouter = new Router({
  prefix: "/account",
});

// 控制器函数
accountRouter.get("/searchday", searchDay); //按日期查询
accountRouter.get("/searchmonth", searchMonth); //按月份查询
accountRouter.get("/searchpie", searchPie); // 饼图数据接口请求。
accountRouter.get("/searchuser", searchUser); // 用户界面数据接口请求。
accountRouter.get("/searchtotalday", searchTotalDay); // 用户记录天数 数据接口请求。
accountRouter.get("/searchyear", searchYear); // 请求每年的数据

accountRouter.post("/update", updateData); // 修改每一天的数据

accountRouter.post("/add", addComment); //添加数据

accountRouter.post("/delete", deleteComment); //删除数据

module.exports = accountRouter;
