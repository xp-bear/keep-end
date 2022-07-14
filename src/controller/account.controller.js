const connection = require("../app/database");

class AccountController {
  async create(ctx, next) {
    // 执行SQL语句
    let sql = "select * from record limit 0,10;";
    const [res] = await connection.execute(sql);
    // console.log(result);
    ctx.body = res;
  }

  // 前10天数据查询
  async untilTen(ctx, next) {
    let sql = "SELECT * FROM record WHERE TO_DAYS( NOW() ) - TO_DAYS( date ) = 2";
    const [res] = await connection.execute(sql);
    ctx.body = res;
  }

  // 添加数据
  async addComment(ctx, next) {
    console.log(ctx.request.body);
    let { value, date, currentTime, message, incomeState, tag_index } = ctx.request.body;
    message = message == "" ? "暂无备注与留言啦!" : message;
    let sql = `insert into record(money,date,time,comment,tag,income_state) values('${value}', '${date}', '${currentTime}', '${message}', ${tag_index}, ${incomeState});`;
    const [res] = await connection.execute(sql);
    console.log(res);
    ctx.body = res;
  }
}

module.exports = new AccountController();
