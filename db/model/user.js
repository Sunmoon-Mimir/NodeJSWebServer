const { Sequelize } = require('sequelize');
const seq = require('../seq');

/*
参数：
    1.用于指定表的名称
    2.用于指定表中有哪些字段
    3.用于配置表的一些额外信息
    4.
*/
/*注意点：
1.sequelize在根据模型创建表的时候，会自动将我们指定的表的名称变成复数
2.sequelize在根据模型创建表的时候，会自动增加2个字段，createAt/updateAt
*/
const User = seq.define('user', {
    id: {
        type: Sequelize.inteage,
        primaryKey: true,
        autoIncrement: true
    },
    username: {
        type: Sequelize.string,
        primaryKey: false,
        unique: true
    },
    password: {
        type: Sequelize.string,
        allowNull: false,
        unique: false
    },
    gender: {
        type: Sequelize.enum(['男', '女']),
        defaultValue: '女'
    }
}, {
    freezeTableName: true,//告诉seq不需要自动将表名变成复数
    timestamps: true,//不需要自动创建createAt/updateAt字段
});

//1.测试配置是否正确
seq.authenticate()
    .then(() => {
        console.log('数据库连接成功！');
    })
    .catch(err => {
        console.error('数据库连接失败：', err);
    });

// 2.执行同步方法，创建表
seq.sync()
    .then(() => {
        console.log('表创建成功');
        process.exit();
    })
    .catch(err => {
        console.error('表创建失败：', err);
        process.exit(1)
    })


module.exports = User;