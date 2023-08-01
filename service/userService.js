// const { exc, escape } = require('../db/mysql');
const User = require('../db/model/user');
async function getUser(username, password) {
    // username = escape(username);
    // password = escape(password);
    if (password) {
        // User
        // let sql = `select * from user where username = ${username} and password = ${password}`;
        // let result = await exc(sql);
        // return result;

        let result = await User.findOne({
            where: {
                username: username,
                password: password
            }
        })
        return result;
    } else {
        // let sql = `select * from user where username = ${username}`;
        // let result = await exc(sql);
        // return result;
        let result = await User.findAll({
            where: {
                username: username
            }
        })
        return result['dataValues'];
    }
}

async function insertUser(username, password, gender) {
    // let sql = `insert into user (username,password,gender) values ('${username}','${password}','${gender}')`;
    // let result = await exc(sql);
    // return result;
    let result = await User.create({
        username: username,
        password: password,
        gender: gender
    })
    return result['dataValues'];
}

module.exports = {
    getUser,
    insertUser
}