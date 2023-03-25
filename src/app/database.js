const mysql = require("mysql2");

const config = require("./config");

// 创建连接池，与数据库进行连接
const connections = mysql.createPool({
  host: config.MYSQL_HOST,
  port: config.MYSQL_PORT,
  database: config.MYSQL_DATABASE,
  user: config.MYSQL_USER,
  password: config.MYSQL_PASSWORD,
});

// 测试
connections.getConnection((err, conn) => {
  // err为空即为成功
  conn.connect((err) => {
    if (err) {
      console.log("数据库连接失败", err);
    } else {
      console.log("数据库连接成功");
    }
  });
});

// 链接mysql数据库,进行创建数据库的操作
const db = mysql.createConnection({
  host: config.MYSQL_HOST,
  user: config.MYSQL_USER,
  password: config.MYSQL_PASSWORD,
});

// 使用promise封装查询数据库的操作
let bdbs = (sql, values) => {
  return new Promise((resolve, reject) => {
    db.query(sql, values, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};
// 使用promise封装查询数据库的操作
let query = (sql, values) => {
  return new Promise((resolve, reject) => {
    connections.getConnection((err, connection) => {
      if (err) {
        reject(err);
      } else {
        connection.query(sql, values, (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
          connection.release(); //释放该链接，把该链接放回池里供其他人使用
        });
      }
    });
  });
};

// 创建数据库 qiniucloud 数据库
let createDB = `create database if not exists account default charset utf8 collate utf8_general_ci;`;
// 创建数据库
let createDatabase = (sql) => {
  return bdbs(sql, []);
};

// 创建表
let createTable = (sql) => {
  return query(sql, []);
};
// 建表sql语句
// files表
let record_sql = `create table if not exists record(
  record_id INT NOT NULL  AUTO_INCREMENT,  
  record_state INT NOT NULL COMMENT '0-支出 1-收入',
  record_tag INT NOT NULL COMMENT '收消标签 0-服饰鞋帽 1-交通出行 2-食物小吃 3-学习提升...',
  record_create_time date NOT NULL COMMENT '收消创建时间 2023/12/2',
  record_comment VARCHAR(500) DEFAULT '暂无备注' COMMENT '收消备注',
  record_money DECIMAL(10, 2) NOT NULL COMMENT '收消金额',
  record_date VARCHAR(100) NOT NULL COMMENT '收消所属日期 2023/03',
  record_time time NOT NULL COMMENT '收消时间',
  PRIMARY KEY(record_id)
)`;

//先创建数据库再创建表
async function create() {
  await createDatabase(createDB);
  await createTable(record_sql);
}
create();
// ------------------------------------------

// 通过promise操作数据库
module.exports = connections.promise();
