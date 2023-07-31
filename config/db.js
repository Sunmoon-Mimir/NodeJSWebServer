let MYSQL_CONFIG;
let REDIS_CONFIG;

if (process.env.NODE_ENV === 'dev') {
    MYSQL_CONFIG = {
        databaseName: 'demo',
        databaseUserName: 'root',
        databasePassword: '123456',
        conf: {
            host: '127.0.0.1',//mysql服务器地址
            port: '3306',//mysql服务器端口号
            dialect: 'mysql',//告诉sequelize当前操作的服务器类型
            pool: {
                max: 5,//最多有多少连接
                min: 0,//最少有多少连接
                idle: 10000,//当连接多久没有操作就断开
                acquire: 30000//多久没有获取到连接就断开
            }
        }
    }
    REDIS_CONFIG = {
        host: '127.0.0.1',
        port: '6379'
    }
} else if (process.env.NODE_ENV === 'pro') {
    MYSQL_CONFIG = {
        databaseName: 'demo',
        databaseUserName: 'root',
        databasePassword: '123456',
        conf: {
            host: '127.0.0.1',//mysql服务器地址
            port: '3306',//mysql服务器端口号
            dialect: 'mysql',//告诉sequelize当前操作的服务器类型
            pool: {
                max: 5,//最多有多少连接
                min: 0,//最少有多少连接
                idle: 10000,//当连接多久没有操作就断开
                acquire: 30000//多久没有获取到连接就断开
            }
        }
    }
    REDIS_CONFIG = {
        host: '127.0.0.1',
        port: '6379'
    }
}

module.exports = {
    MYSQL_CONFIG, REDIS_CONFIG
};