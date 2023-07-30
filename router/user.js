const {
    USER_LOGIN,
    USER_REGISTER,
    USER_INFO } = require('./routerConst');
const {
    SuccessModel,
    ErrorModel
} = require('../model/ResultModel');
const Ajv = require('ajv');
const ajv = new Ajv();
const exc = require('../db/mysql');
const userSchema = require('../validator/userValidator');
const { registerUser, loginCheck } = require('../controller/userController');
const { generateSalt } = require('../utils/crypto');
/*
如何存储用户的登录状态？
1.客户端存储 cookie
2.服务端存储 session
3.保存的登录状态也需要加密保存

cookie的特点
在服务端和客户端中都可以对cookie进行crud
每次客户端发送request，都会自动把当前域名的cookie自动发送给服务端
*/

/*1.客户端存储登录状态的不足
1.cookie存储有大小限制
2.存储的内容根据业务需求有更多的存储要求
3.存储在客户端的信息需要加密，否则有暴露的风险
但如果所有信息都加密，服务器还需要存储存储加密的映射关系
否则也无法得知加密信息的内容
综上所述，为了提示数据安全性，以及存储更多内容
我们可以在服务端session存储登录状态*/

/*2.session如何存？
1.给每个用户分配一个无关紧要的值作为标识
2.在服务端定义一个全局变量为session容器
3.将用户的唯一标识作为key，登录后给容器的key添加登录状态信息
*/

// const getCookieExpires = () => {
//     let date = new Date();
//     date.setTime(date.getDate() + (24 * 60 * 60 * 1000));
//     return date.toGMTString();
// }

const userRouterHandle = async (req, res) => {
    if (req.method === 'POST' && req.path === USER_LOGIN) {
        let result = loginCheck(req.body);
        if(result.code===200){
            req.session.username = result.data.username;
            req.session.password = result.data.password;
            req.session.gender = result.data.gender;
        }

        //在客户端保存登录状态，客户端cookie会存储它们
        /*cookie安全性：客户端服务端都可以修改，存在安全隐患，
        1. 设置httpOnly保证只允许在服务端修改
        2. 设置过期时间
        */

        /*
        //客户端保存登录状态
        // if (result.code === 200) {
        //     res.setHeader('Set-Cookie', `username=${generateSalt(req.body.username)};path=/;httpOnly;expires=${getCookieExpires()}`);
        // }
        */
        /* 保存登录状态后由于serverHandle设置了writeHead
        writeHead必须在setHeader之后，否则报错
        此时需要单独封装res.end，再每次res.end之前writeHead
        */
        return result;
        /*先使用假数据模拟
        return {
            code: 200,
            data: '登录成功'
        }*/
    } else if (req.method === 'POST' && req.path === USER_REGISTER) {
        /*假数据sql
        let sql = `insert into user (id,username,password) values(3,'paxmimir',123456)`;
        exc(sql).then(result => {
            console.log(result);
        }).catch((err) => {
            console.error(err);
        })
        let valid = ajv.validate(userSchema, req.body);
        console.log({ valid });
        console.error(ajv.errors);
        */
        /*
        // 1.校验数据是否正确
        let valid = userValid(req.body);
        console.log({ valid });

        //2.判断当前注册的用户是否存储
        let userIsExist = await userExist(req.body.username);
        console.log({ userIsExist })

        //3.判断是否可以注册
        if (valid === true && userIsExist === false) {
            console.log('可以注册');
        } else {
            console.log('数据校验不通过，或已注册');
        }
        */
        //抽象业务逻辑到userController
        //由于是异步，app.js层也需要异步执行
        let result = await registerUser(req.body);
        return result;
        //处理注册
        // return new ErrorModel('注册失败', {});
    } else if (req.method === 'GET' && req.path === USER_INFO) {
        return new SuccessModel('获取信息成功', { name: 'xmy', age: 23 });
    }
}

module.exports = userRouterHandle;