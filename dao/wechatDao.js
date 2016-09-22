// dao/userDao.js
// 实现与MySQL交互
var $sql = require('./wechatSqlMapping');
var $dbc = require('./dbCommon');
var weixin = require('weixin-api');
var config = require('../conf/config.json');
var wechatUtil = require('../util/wechatUtil');

weixin.token = config.wechat.token;
wechatUtil.appid = config.wechat.appID;
wechatUtil.secret = config.wechat.appSecret;
wechatUtil.apiPrefix = config.wechat.apiPrefix;
wechatUtil.mpPrefix = config.wechat.mpPrefix;

module.exports = {
    checkToken: function (req, res, next) {
        if (weixin.checkSignature(req)) {
            res.status(200).send(req.query.echostr);
        } else {
            res.status(200).send('非法请求');
        }
    },
    getAccessToken: function (req, res, next) {
        wechatUtil.getAccessToken(function(accessToken){
            res.status(200).send(accessToken);
        });
    }

};
