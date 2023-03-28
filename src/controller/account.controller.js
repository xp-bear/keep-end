const connection = require("../app/database");

class AccountController {
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

  // 查询饼图数据
  async searchPie(ctx, next) {
    let date = ctx.query.monthdata; //2023/12 月份数据
    let flagState = +ctx.query.flag; //收入与支出状态 0-支出 1-收入

    let sql = `SELECT * FROM record WHERE record_state=${flagState} and record_date='${date}';`;
    const [res] = await connection.execute(sql);

    // 把结果统计成一个对象
    let obj = {};
    let totalMoney = null; //所有数据总金额
    res.filter((item, index) => {
      if (obj[item.record_tag]) {
        obj[item.record_tag] = obj[item.record_tag] + +item.record_money;
      } else {
        obj[item.record_tag] = +item.record_money;
      }
      totalMoney += +item.record_money;
      // obj[item.record_tag] ? (obj[item.record_tag] = obj[item.record_tag] + +item.record_money) : (obj[item.record_tag] = +item.record_money);
    });
    // console.log("总金额:", totalMoney);

    // 把对象处理成指定的格式,然后返回
    let result = [];
    let tags = null;
    if (flagState == 0) {
      tags = ["服饰鞋帽", "交通出行", "食物小吃", "学习提升", "外出旅行", "娱乐消费", "其他项目"]; //支出饼图图标
    } else {
      tags = ["工资薪金", "劳务报酬", "偶然所得", "企业红利", "其他项目"]; //收入饼图图标
    }
    // console.log(obj);
    for (let key in obj) {
      result.push({
        name: obj[key] == true ? "" : tags[key] + Math.ceil((obj[key] / totalMoney) * 100) + "%",
        value: obj[key] == true ? 0 : obj[key],
      });
    }

    ctx.body = result;
  }

  // 添加数据
  async addComment(ctx, next) {
    let { record_state, record_tag, record_create_time, record_comment, record_money, record_date, record_time } = ctx.request.body;
    record_comment = record_comment.length == 0 ? "暂无备注" : record_comment;
    let sql = `insert into record(record_state, record_tag, record_create_time, record_comment, record_money, record_date, record_time) values(${record_state}, ${record_tag}, '${record_create_time}', '${record_comment}', ${record_money}, '${record_date}', '${record_time}');`;

    const [res] = await connection.execute(sql);

    ctx.body = res;
  }

  // 删除数据
  async deleteComment(ctx, next) {
    // 根据ID删除数据。
    let { record_id } = ctx.request.body;
    let sql = `DELETE FROM record WHERE record_id=${record_id};`;
    const [res] = await connection.execute(sql);
    ctx.body = res;
  }
}

module.exports = new AccountController();
