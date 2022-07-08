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
    let sql = "SELECT * FROM record WHERE TO_DAYS( NOW() ) - TO_DAYS( date ) = 1";
    const [res] = await connection.execute(sql);
    ctx.body = res;
  }
}

module.exports = new AccountController();
