//1.导入mysql模块
const mysql = require('mysql');
const { MYSQL_CONFIG } = require('../config/db');
//2. 创建连接对象

const connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '123456',
    port: '3306',
    database: 'demo'
});
//3. 连接mysql数据库
connection.connect();
//4. 操作mysql数据库，封装一个函数，让其他涉及mysql的文件调用这一函数
const exc = (sql) => {
    return new Promise((resolve, reject) => {
        connection.query(sql, function (error, results, fields) {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    })
}

// connection.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
//   if (error) throw error;
//   console.log('The solution is: ', results[0].solution);
// });

module.exports = {
    exc,
    escape: mysql.escape
};