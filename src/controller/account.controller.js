const connection = require("../app/database");

class AccountController {
  async create(ctx, next) {
    // 执行SQL语句
    let sql = "select * from heros limit 0,10;";
    const [res] = await connection.execute(sql);
    // console.log(result);
    ctx.body = res;
  }
}

module.exports = new AccountController();
