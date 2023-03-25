const connection = require("../app/database");

class AccountController {
  // 首页请求数据
  async create(ctx, next) {
    // 执行SQL语句
    let sql = "select * from record limit 0,10;";
    const [res] = await connection.execute(sql);
    // console.log(result);
    ctx.body = res;
  }

  // 查询当前日期
  async searchDay(ctx, next) {
    // console.log(ctx.query);
    let date = ctx.query.date; //2023/12/2 查询日期
    let flagState = +ctx.query.flag; //收入与支出状态 0-支出 1-收入

    let sql = `SELECT * FROM record WHERE record_state=${flagState} and record_create_time='${date}' order by record_time asc;`;
    const [res] = await connection.execute(sql);
    ctx.body = res;
  }
  // 查询当月数据
  async searchMonth(ctx, next) {
    let date = ctx.query.monthdata; //2023/12 月份数据
    let flagState = +ctx.query.flag; //收入与支出状态 0-支出 1-收入

    let sql = `SELECT * FROM record WHERE record_state=${flagState} and record_date='${date}' order by record_create_time , record_time asc;`;
    const [res] = await connection.execute(sql);
    let obj = {};
    res.filter((item, index) => {
      obj[item.record_create_time] ? obj[item.record_create_time].push(item) : (obj[item.record_create_time] = [item]);
    });
    ctx.body = obj;
  }

  // 添加数据
  async addComment(ctx, next) {
    let { record_state, record_tag, record_create_time, record_comment, record_money, record_date, record_time } = ctx.request.body;
    record_comment = record_comment.length == 0 ? "暂无备注" : record_comment;
    let sql = `insert into record(record_state, record_tag, record_create_time, record_comment, record_money, record_date, record_time) values(${record_state}, ${record_tag}, '${record_create_time}', '${record_comment}', ${record_money}, '${record_date}', '${record_time}');`;

    const [res] = await connection.execute(sql);

    ctx.body = res;
  }
}

module.exports = new AccountController();
