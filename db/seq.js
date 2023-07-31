const { Sequelize } = require('sequelize');
const { MYSQL_CONFIG } = require('../config/db');
//2.配置连接信息
/*
参数：
    1. 要操作的数据库名称
    2. 数据库用户名
    3. 数据库密码
    4. 其他的配置信息
*/
const seq = new Sequelize(
    MYSQL_CONFIG.databaseName,
    MYSQL_CONFIG.databaseUserName,
    MYSQL_CONFIG.databasePassword,
    MYSQL_CONFIG.conf
);

//3.测试配置是否正确
console.log(MYSQL_CONFIG.databaseName);

module.exports = seq;