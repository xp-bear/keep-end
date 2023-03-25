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
