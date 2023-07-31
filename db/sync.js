const seq = require('./seq');

//0.导入模型
require('./model/user')

//1.测试配置是否正确
try {
    await seq.authenticate();
    console.log('Connection has been established successfully.');
} catch (error) {
    console.error('Unable to connect to the database:', error);
}

//2.执行同步方法，创建表
seq.sync()
    .then(() => {
        console.log('sync ok');
        process.exit();
    })
    .catch(err => {
        console.error('表创建失败：', err);

    })
