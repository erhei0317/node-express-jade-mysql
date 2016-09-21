var express = require('express');
var router = express.Router();

var wechatDao = require('../dao/wechatDao');

/* 微信接口严重页面 需要正确响应微信发送的Token验证 */
router.get('/interface', function(req, res, next) {
    wechatDao.checkToken(req, res, next);
});

/*router.get('/interface', function(req, res, next) {
    wechatDao.openAddIn(req, res, next);
});*/
module.exports = router;

