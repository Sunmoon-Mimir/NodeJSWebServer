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

//保存登录状态的无关紧要的标识
let userid = '';

//准备各种请求参数
const initParams = (req) => {
    //准备：请求方式/请求路径/请求参数
    //1. 请求方式
    const methods = req.method;
    //2.处理请求路径
    req.path = req.url.split('?')[0];
    //3.处理cookie
    req.cookie = {}
    // console.log(`Cookie`, req.headers.cookie);
    req.headers.cookie.split(';').forEach(item => {
        let keyValue = item.split('=');
        req.cookie[keyValue[0]] = keyValue[1];
    })

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
    res.setEnd = setEnd;
    //1.准备各种请求参数
    initParams(req).then(async () => {
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
