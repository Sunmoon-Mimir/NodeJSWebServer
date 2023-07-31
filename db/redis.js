//1.导入Redis
const redis = require('redis');

// 在这里继续处理你的Redis操作

const { REDIS_CONFIG } = require('../config/db');
//2.建立Redis连接
const client = redis.createClient(REDIS_CONFIG.port, REDIS_CONFIG.host);

client.on('error', err => console.log('Redis Client Error', err));

//3.封装保存数据和获取数据的方法
async function redisSet(key, value) {
    if (typeof value === 'object') {
        value = JSON.stringify(value);
    }
    await client.set(key, value, redis.print);
}

async function redisGet(key) {
    new Promise((resolve, reject) => {
        client.get('key', (err, value) => {
            if (err) {
                console.log(err);
                reject(err)
            } else {
                try {
                    resolve(JSON.parse(value));
                } catch (e) {
                    resolve(value);
                }
            }
        });
    })
}

module.exports = {
    redisSet,
    redisGet
}
