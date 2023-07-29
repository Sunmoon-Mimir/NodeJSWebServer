/*
服务端配置文件：
在此文件中提供一个最简单的服务端服务即可
*/
const http =require('http');
const Server = http.createServer();
const port =3000;
const serverHandle = require('../app');

Server.on('request',serverHandle)

Server.listen(port,()=>{
    console.log(`server is running at ${port}`);
});

