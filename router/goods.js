const {
    GOODS_LIST,
    GOODS_DETAIL,
    GOODS_EDIT,
    GOODS_NEW, } = require('./routerConst')
const goodsRouterHandle = (req, res) => {
    if (req.method === 'GET' && req.path === GOODS_LIST) {

    } else if (req.method === 'GET' && req.path === GOODS_DETAIL) {

    } else if (req.method === 'GET' && req.path === GOODS_EDIT) {

    } else if (req.method === 'POST' && req.path === GOODS_NEW) {

    }
}

module.exports = goodsRouterHandle;