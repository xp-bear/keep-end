const connection = require("../app/database");

class AccountController {
  // 查询当前日期
  async searchDay(ctx, next) {
    // console.log(ctx.query);
    let date = ctx.query.date; //2023/12/2 查询日期
    let flagState = +ctx.query.flag; //收入与支出状态 0-支出 1-收入
    let ownerId = +ctx.query.ownerid || -1;
    // console.log(ownerId);
    let sql = `SELECT * FROM record WHERE owner_id=${ownerId} and record_state=${flagState} and record_create_time='${date}' order by record_time asc;`;
    const [res] = await connection.execute(sql);
    ctx.body = res;
  }
  // 查询当月数据
  async searchMonth(ctx, next) {
    let date = ctx.query.monthdata; //2023/12 月份数据
    let flagState = +ctx.query.flag; //收入与支出状态 0-支出 1-收入
    let tag = ctx.query.tag; //按标签查询的类别
    let ownerId = +ctx.query.ownerid;
    let sql = null;
    if (tag) {
      sql = `SELECT * FROM record WHERE owner_id=${ownerId} and record_state=${flagState} and record_date='${date}' and record_tag=${tag} order by record_create_time , record_time asc;`;
    } else {
      sql = `SELECT * FROM record WHERE owner_id=${ownerId} and record_state=${flagState} and record_date='${date}'  order by record_create_time , record_time asc;`;
    }
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
    let ownerId = +ctx.query.ownerid;

    let sql = `SELECT * FROM record WHERE owner_id=${ownerId} and record_state=${flagState} and record_date='${date}';`;
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
      tags = ["工资薪金", "奖金提成", "偶然所得", "投资收益", "劳务报酬", "其他项目"]; //收入饼图图标
    }
    // console.log(obj);
    for (let key in obj) {
      result.push({
        name: obj[key] == true ? "" : tags[key] + Math.ceil((obj[key] / totalMoney) * 100) + "%",
        value: obj[key] == true ? 0 : Math.round(obj[key] * 100) / 100,
      });
    }

    ctx.body = result;
  }

  // 查询用户界面数据
  async searchUser(ctx, next) {
    let ownerId = +ctx.query.ownerid;
    let sql = `select sum(record_money) as totalMoney,count(*) as totalCount from record where owner_id=${ownerId};`;
    const [res] = await connection.execute(sql);
    ctx.body = res;
  }
  // 查询用户天数
  async searchTotalDay(ctx, next) {
    let ownerId = +ctx.query.ownerid;
    let sql = `select COUNT(DISTINCT  record_create_time) as totalDay from record where owner_id=${ownerId};`;
    const [res] = await connection.execute(sql);
    ctx.body = res[0];
  }

  // 按年份查询数据
  async searchYear(ctx, next) {
    let year = ctx.query.year; //2023年
    let flagState = +ctx.query.flag; //收入与支出状态 0-支出 1-收入
    let ownerId = +ctx.query.ownerid;

    let sql = `select sum(record_money) as total_money from record where owner_id=${ownerId} and record_state=${flagState} and  year(record_create_time)=${year};`;
    const [res] = await connection.execute(sql);
    ctx.body = res;
  }
  // 添加数据
  async addComment(ctx, next) {
    try {
      let { owner_id, record_state, record_tag, record_create_time, record_comment, record_money, record_date, record_time } = ctx.request.body;
      // console.log("添加数据。", owner_id);
      record_comment = record_comment.length == 0 ? "暂无备注" : record_comment;
      let sql = `insert into record(record_state, record_tag, record_create_time, record_comment, record_money, record_date, record_time, owner_id) values(${record_state}, ${record_tag}, '${record_create_time}', '${record_comment}', ${record_money}, '${record_date}', '${record_time}',${owner_id});`;

      const [res] = await connection.execute(sql);

      ctx.body = res;
    } catch (error) {
      console.log(error);
    }
  }

  // 修改数据
  async updateData(ctx, next) {
    try {
      // 根据ID和类型进行判断 是收入还是支出
      let { record_state, record_id, record_comment, record_money, record_tag, record_time } = ctx.request.body;

      let sql =
        "UPDATE `record` SET  `record_comment` = '" +
        record_comment +
        "', `record_money` = " +
        record_money +
        ", `record_tag` = " +
        record_tag +
        ", `record_time` = CONCAT(DATE(`record_time`), ' ', '" +
        record_time +
        "') WHERE  `record_state` = " +
        record_state +
        " AND  `record_id` = " +
        record_id +
        ";";

      const [res] = await connection.execute(sql);
      ctx.body = res;
    } catch (error) {
      console.log(error);
    }
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
