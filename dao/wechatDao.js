// dao/userDao.js
// 实现与MySQL交互
var $sql = require('./wechatSqlMapping');
var $dbc = require('./dbCommon');
var weixin = require('weixin-api');
var config = require('config.json');

weixin.token = config.wechat.token;

module.exports = {
    checkToken: function (req, res, next) {
        if (weixin.checkSignature(req)) {
            res.status(200).send(req.query.echostr);
        } else {
            res.status(200).send('fail');
        }
    }
    
};
