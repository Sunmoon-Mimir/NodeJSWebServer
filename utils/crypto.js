const crypto = require('crypto');
const secret = 'zm139'

function md5(password) {
    const md5 = crypto.createHash('md5')
        .update(password)//指定需要加密的内容
        .digest('hex');//指定加密后输出的格式
    return md5;
}

function generateSalt(password) {
    let passwordSal = secret + password;
    let hash = md5(passwordSal);
    return hash;
}

/*
MD5加密的内容，只要内容没有变化加密后的内容也不会发生变化
虽然MD5加密不可逆，但是依然可以暴力破解
破解方法：预生成很多MD5，与数据库中的MD5作比对，就可以轻易知道明文内容
加密之前应该对原始数据进行加盐操作，给原始数据混入其他数据
*/

module.exports = {
    generateSalt
}