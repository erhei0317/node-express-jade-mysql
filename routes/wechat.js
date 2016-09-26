var express = require('express');
var router = express.Router();

var wechatDao = require('../dao/wechatDao');

/* 微信接口验证页面 需要正确响应微信发送的Token验证 */
router.get('/interface', function(req, res, next) {
    wechatDao.checkToken(req, res, next);
});
/* 接收微信发送过了的事件 */
router.post('/interface', function(req, res, next) {
    wechatDao.getWechatMsg(req, res, next);
});
//获取微信基础接口token
router.get('/getAccessToken', function(req, res, next) {
    wechatDao.getAccessToken(req, res, next);
});
//用户进入此访问地址，会重定向到网页授权发起页面
router.get('/oauth', function(req, res, next) {
    wechatDao.oauth(req, res, next);
});
//用户进入此访问地址，会重定向到网页授权发起页面
router.get('/oauthCallback', function(req, res, next) {
    wechatDao.oauthCallback(req, res, next);
});

/*router.get('/interface', function(req, res, next) {
    wechatDao.openAddIn(req, res, next);
});*/
module.exports = router;

