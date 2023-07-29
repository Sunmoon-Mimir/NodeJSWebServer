let MYSQL_CONFIG;

if (process.env.NODE_ENV === 'dev') {
    MYSQL_CONFIG = {
        host: '127.0.0.1',
        user: 'root',
        password: '123456',
        port: '3306',
        database: 'demo'
    }
} else if (process.env.NODE_ENV === 'pro') {
    MYSQL_CONFIG = {
        host: 'localhost',
        user: 'XXXX',
        password: 'XXXXXX',
        port: '3306',
        database: 'myblog'
    }
}

module.exports = MYSQL_CONFIG;