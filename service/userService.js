const { exc, escape } = require('../db/mysql');
async function getUser(username, password) {
    username = escape(username);
    password = escape(password);
    if (password) {
        let sql = `select * from user where username = ${username} and password = ${password}`;
        let result = await exc(sql);
        return result;
    } else {
        let sql = `select * from user where username = ${username}`;
        let result = await exc(sql);
        return result;
    }
}

async function insertUser(username, password, gender) {
    let sql = `insert into user (username,password,gender) values ('${username}','${password}','${gender}')`;
    let result = await exc(sql);
    return result;
}

module.exports = {
    getUser,
    insertUser
}