const userSchema = require('../validator/userValidator');
const Ajv = require('ajv');
const ajv = new Ajv();
const { getUser, insertUser } = require('../service/userService');
const { SuccessModel, ErrorModel } = require('../model/ResultModel');
const { userDataFail, userExistFail, userRegFail, userLoginFail } = require('../config/errorConst');
const { generateSalt } = require('../utils/crypto');

function userValid(data) {
    return ajv.validate(userSchema, data);
}

async function userExist(username) {
    let users = await getUser(username);
    // console.log({users});数组[]
    return users.length === 0 ? false : true;
}

async function registerUser(data) {
    // 1.校验数据是否正确
    let valid = userValid(data);
    if (!valid) {
        return new ErrorModel(userDataFail);
    }
    //2.判断当前注册的用户是否存储
    let userIsExist = await userExist(data.username);
    console.log({ userIsExist })

    //3.判断是否可以注册
    if (valid === true && userIsExist === false) {
        try {
            let regUser = await insertUser(data.username, generateSalt(data.password), data.gender);
            console.log({ regUser });
            return new SuccessModel({ code: 200, msg: '注册成功' });
        } catch (error) {
            console.error(error);
            return new ErrorModel(userRegFail);
        }
    } else {
        return new ErrorModel(userExistFail);
    }
    /*逻辑链路：
    1.Router收到请求，并把请求交给Controller处理
    2.Controller需要用到数据，交给Service处理
    3.Service从数据库获取数据，会把数据返回给Controller
    4.Controller根据数据判断用户是否存在，接着把判断结果交给Router
    5.Router决定如何执行，执行结束后把结果以JSON或网页形式返回
    */
}

async function loginCheck(data) {
    let passwordSalt = generateSalt(data.password);
    let result = await getUser(data.username, passwordSalt);
    console.log({ result });
    if (result.length > 0) {
        let data = {
            id: result[0].id,
            username: result[0].username,
            gender: result[0].gender
        }
        return new SuccessModel({ code: 200, msg: '登录成功', data: data });
    } else {
        return new ErrorModel(userLoginFail);
    }
}

module.exports = {
    userValid,
    userExist,
    registerUser,
    loginCheck
}