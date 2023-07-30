console.log(process.env.NODE_ENV)//dev pro
/*服务端业务逻辑的核心文件
处理各种请求
*/

const qs = require('querystring');
const goodsRouterHandle = require('./router/goods');
const userRouterHandle = require('./router/user');
const path = require('path')
const staticServer = require('./utils/staticServer');
const rootPath = path.join(__dirname, 'public');
/*1.当前服务端存储存在的问题
-操作系统会给每一个应用程序分配一块存储空间
    +当前session是一个全局变量，全局变量使用的是当前应用程序分配到的存储空间
    所以当前的这种服务端存储登录状态的方式也会出现‘存不下’的情况
    +当前的session是一个全局变量，全局变量的特点是app启动时分配存储空间
    关闭时释放空间，每次对项目进行更新时都需要重启，运维人员日常运维也可能会经常重启
    这样频繁的要求用户登录，就会带来不好的体验
-现在的服务端性能优越，内存大，CPU也是多核任务的，
 所以如果一台机器上如果只运行一个NodeJS进程会对资源造成极大的浪费
 所以在企业开发中我们会在一台机器上跑多个NodeJS进程，来提升效率和使用率
 但是每个进程之间的内存是互相隔离的，所以就会导致在登录状态‘无法共享’
*/
/*2.如何解决当前session的问题？
-要解决当前session的问题，首先我们要知道session的特点
 +数据量不会太大，存储的都是一些常用信息
 +访问频率极高，对性能要求较高，每次操作都会验证session
 +不害怕丢失，丢失之后再次登录即可
-如何满足如上特点的同时解决存在的问题？
 +Redis可以搭建集群突破内存限制
 +只要Redis不重启数据就不会消失
 +存储在Redis中的数据，无论哪个nodejs进程都是可以访问的
 +Redis性能极好，速度极快
*/

//定义变量作为session的容器
const SESSION_CONTAINER = {};

const getCookieExpires = () => {
    let date = new Date();
    date.setTime(date.getDate() + (24 * 60 * 60 * 1000));
    return date.toGMTString();
}

const initCookieSession = (req, res) => {
    //1.处理cookie
    req.cookie = {}
    // console.log(`cookie`, req.headers.cookie);
    //解析客户端带过来的cookie
    if (req.headers.cookie) {
        // console.log('req.headers.cookie:', req.headers.cookie)
        req.headers.cookie.split(';').forEach(item => {
            let keyValue = item.split('=');
            req.cookie[keyValue[0]] = keyValue[1];
        })
    }

    //2.（检查这个cookie有没有标识，没有就生成）获取用户的唯一标识
    req.userId = req.cookie.userId;
    if (!req.userId) {
        req.userId = `${Date.now()}_${Math.random()}_xmy`;
        //给当前用户分配容器（没有userid的情况下创建后，分配）
        SESSION_CONTAINER[req.userId] = {};
        res.setHeader('Set-Cookie', `userId=${req.userId};path=/;httpOnly;expires=${getCookieExpires()}`);
    }
    if (!SESSION_CONTAINER[req.userId]) {
        //给当前用户分配容器，有userid没有容器的情况下分配
        SESSION_CONTAINER[req.userId] = {}
    }
    //3.将它挂进req上
    req.session = SESSION_CONTAINER[req.userId];
}

//准备各种请求参数
const initParams = (req, res) => {
    //准备：请求方式/请求路径/请求参数
    //1. 请求方式
    const methods = req.method;
    //2.处理请求路径
    req.path = req.url.split('?')[0];
    // //3.处理cookie
    // req.cookie = {}
    // // console.log(`cookie`, req.headers.cookie);
    // if (req.headers.cookie) {
    //     console.log('req.headers.cookie',req.headers.cookie)
    //     req.headers.cookie.split(';').forEach(item => {
    //         let keyValue = item.split('=');
    //         req.cookie[keyValue[0]] = keyValue[1];
    //     })
    // }


    /*//4.获取用户的唯一标识
    req.userId = req.cookie.userId;
    if (!req.userId) {
        req.userId = `${Date.now()}_${Math.random()}_xmy`;
        res.setHeader('Set-Cookie', `userId=${req.userId};path=/;httpOnly;expires=${getCookieExpires()}`);
    }*/

    //3.处理请求参数
    return new Promise((resolve, reject) => {
        if (methods === 'GET') {
            let params = req.url.split('?')[1];
            req.query = qs.parse(params);
            resolve();
        } else if (methods === 'POST') {
            let params = "";
            req.on('data', (chunk) => {
                params += chunk;
            })
            req.on('end', () => {
                req.body = qs.parse(params);
                console.log({ params });
                resolve();
            })
        }
    })
}

const setEnd = (res, data) => (
    res.writeHead(200, {
        'Content-Type': 'application/json;charset=utf-8;'
    }),


    res.end(JSON.stringify(data))
)

const serverHandle = async (req, res) => {
    /*如何处理客户端请求
    需要知道：请求方式/请求路径/请求参数
    */

    //1.返回静态网页
    // await staticServer.readFile(req, res, rootPath);
    //2.处理api请求
    // res.writeHead(200, {
    //     'Content-Type': 'application/json;charset=utf-8;'
    // })
    //3.准备cookie和session
    initCookieSession(req, res);

    res.setEnd = setEnd;
    //1.准备各种请求参数
    initParams(req, res).then(async () => {
        //2.处理各种路由
        // console.log(`method:`, req.method);
        // console.log(`path:`, req.path);
        // console.log(`query:`, req.query);
        // console.log(`body:`, req.body);
        //商品路由
        let goodsData = await goodsRouterHandle(req, res);
        if (goodsData) {
            res.setEnd(res, goodsData)
            return;
        }
        //用户路由
        let userData = await userRouterHandle(req, res);
        if (userData) {
            res.setEnd(res, userData)
            return;
        }
        //意外的路由返回404
        res.writeHead(404, {
            'Content-Type': 'text/plain;charset=utf-8'
        })
        res.end('404 NOT FOUND');
    }).catch((err) => {
        console.error(err);
    })

    /*各种各样的路由地址
    操作商品接口
    /api/goods/list
    /api/goods/detail
    /api/goods/edit
    /api/goods/new
    操作用户接口
    /api/user/login
    /api/user/register
    /api/user/info
    ...
    */
}

/*
不同的暴露方式，就会有不同的调用方式
module.exports = {
    serverHandle
}

serverHandle.serverHandle
*/

module.exports = serverHandle
