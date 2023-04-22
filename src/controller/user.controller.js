const connection = require("../app/database");
const config = require("../app/config");
const CryptoJS = require("crypto-js");
const dayjs = require("dayjs");
class UserController {
  // 登录接口
  async login(ctx, next) {
    // 登录接口
    let { username, password } = ctx.request.body;

    // 保存过期的日期
    // 获取当前时间
    let currentDate = new Date();
    // 将当前时间加7天
    currentDate.setDate(currentDate.getDate() + 7);
    // 获取新日期
    let newDate = currentDate.toLocaleDateString();
    // 加密
    let token = CryptoJS.AES.encrypt(JSON.stringify(newDate), "coderxp").toString();
    console.log(token); //加密

    // let decryptedStr = CryptoJS.AES.decrypt(token, "coderxp").toString(CryptoJS.enc.Utf8);
    // console.log(decryptedStr); //解密

    ctx.body = "ok";

    let sql = `SELECT user_id,username,avatar,sex,create_time FROM user where username='${username}' and password='${password}';`;
    const [res] = await connection.execute(sql);
    // 结果判断
    if (res.length <= 0) {
      ctx.body = {
        message: "用户名或者密码错误",
        code: 400,
      };
    } else {
      ctx.body = {
        code: 200,
        message: "登录成功",
        result: res[0],
        token,
      };
    }
  }

  // 注册接口
  async register(ctx, next) {
    try {
      let { username, email, password } = ctx.request.body;

      let sql = `insert into user(username,password,email,create_time) values('${username}','${password}','${email}','${dayjs(new Date()).format("YYYY-MM-DD HH:mm:ss")}');`;
      const [res] = await connection.execute(sql);
      ctx.body = res;
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = new UserController();
