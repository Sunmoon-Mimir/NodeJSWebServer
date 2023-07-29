/**
 *
 * @param {*} req 请求对象
 * @param {*} res 响应对象
 * @param {*} rootPath 静态资源所在的目录
 */

const path = require('path');
const fs = require('fs');
const mime = require('./mime.json');

function readFile(req, res, rootPath) {
    //1. 获取静态资源的地址
    // http://127.0.0.1:3000/bilibili.html
    // console.log(`rootPath:`, rootPath);
    // console.log(`req.url:`, req.url);
    let fileName = req.url.split('?')[0];
    let filePath = path.join(rootPath, fileName);
    // console.log('fileName:', fileName);
    // console.log(`filePath:`, filePath);
    //2.判断静态资源是否存在
    let isExists = fs.existsSync(filePath);
    if (!isExists) {
        res.end(`404 Not Found`);
        return;
    }
    //2.1 获取静态资源的mime类型(后缀名)
    let fileExt = path.extname(filePath);//.html
    //2.2 根据文件的后缀名获取对应的mime类型
    let type = mime[fileExt.split('.')[1]];
    // console.log(`type:`, type);
    //2.3 告诉客户端返回的数据类型
    res.writeHead(200, {
        'Content-Type': `${type};charset=utf-8`
    });
    //3. 加载静态资源并且返回静态资源
    //1. path：文件名或文件描述符
    //2. options: encoding, flag,signal
    //3. callback: 回调传入了两个参数 (err, data)，其中 data 是文件的内容。

    /*无法正常代理静态资源的原因：
    文件读取是异步操作，
    app.js中的处理路由时无法匹配到路由
    则返回了404notFound
    需要将文件读写改为promise
    让文件读取完毕后，再继续向下执行
    调用时也需要异步执行：
    await staticServer.readFile(req, res, rootPath);
    */
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, (err, data) => {
            if (err) {
                res.end(`Server Error`);
                reject(err);
            } else {
                res.end(data);
                resolve();
            }
        })
    })

    // fs.readFile(filePath, (err, data) => {
    //     if (err) {
    //         res.end(`500 Server Error`);
    //         return;
    //     }
    //     res.end(data);
    // })
}

module.exports = {
    readFile
}