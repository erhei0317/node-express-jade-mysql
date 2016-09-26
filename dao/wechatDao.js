// dao/userDao.js
// 实现与MySQL交互
var $sql = require('./wechatSqlMapping');
var $dbc = require('./dbCommon');
var wechatUtil = require('../util/wechatUtil');
var OAuth = require('wechat-oauth');            //微信网页授权
var config = require('../conf/config.json');

var client = new OAuth(config.wechat.appID, config.wechat.appSecret);

module.exports = {
    checkToken: function (req, res, next) {
        if (wechatUtil.checkSignature(req)) {
            res.status(200).send(req.query.echostr);
        } else {
            res.status(200).send('非法请求');
        }
    },
    getAccessToken: function (req, res, next) {
        wechatUtil.getAccessToken(function(accessToken){
            res.status(200).send(accessToken);
        });
    },
    getWechatMsg: function (req, res, next) {
        wechatUtil.getWechatMsg(req, res);
    },
    goOauth: function (req, res, next) {
        var url = client.getAuthorizeURL('http://' + config.wechat.domain + '/wechat/callback','state','snsapi_userinfo');
        res.redirect(url)
    },
    oauthCallback: function (req, res, next) {
        var code = req.query.code;
        res.status(200).send(code);
    }

};
