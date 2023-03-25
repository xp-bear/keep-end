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
let files_sql = `create table if not exists files(
  file_id INT NOT NULL AUTO_INCREMENT,  
  file_upload_time VARCHAR(100) NOT NULL COMMENT '上传时间',
  file_type INT NOT NULL COMMENT '文件类型 0-图片  1-视频  2-txt文件 3-doc文件 4-pdf文件 5-ppt文件 6-表格文件 7-压缩文件 8-未知文件',
  file_link VARCHAR(1000) NOT NULL COMMENT '上传地址链接',
  file_suffix VARCHAR(50) NOT NULL COMMENT '后缀名',
  file_name VARCHAR(1000) NOT NULL COMMENT '文件名',
  file_size VARCHAR(100) NOT NULL COMMENT '文件大小',
  file_region VARCHAR(100) NOT NULL COMMENT '文件存储区域',
  file_user_id INT NOT NULL COMMENT '所属者上传id',
  file_user_name VARCHAR(100) NOT NULL COMMENT '所属者上传昵称',
  file_remark VARCHAR(1000)  COMMENT '上传文件备注',
  file_address VARCHAR(100)  COMMENT '图片上传地址位置',
  file_view INT NOT NULL  COMMENT '文件浏览量',
  PRIMARY KEY(file_id)
)`;

//先创建数据库再创建表
async function create() {
  await createDatabase(createDB);
  await createTable(files_sql);
  //   await createTable(users_sql);
  //   await createTable(likes_sql);
  //   await createTable(feedbacks_sql);
  //   await createTable(collects_sql);
}
create();
// ------------------------------------------

// 通过promise操作数据库
module.exports = connections.promise();
