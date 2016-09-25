// dao/userDao.js
// 实现与MySQL交互
var $sql = require('./wechatSqlMapping');
var $dbc = require('./dbCommon');
/*var weixin = require('weixin-api');
var config = require('../conf/config.json');*/
var wechatUtil = require('../util/wechatUtil');

/*weixin.token = config.wechat.token;
wechatUtil.appid = config.wechat.appID;
wechatUtil.secret = config.wechat.appSecret;
wechatUtil.apiPrefix = config.wechat.apiPrefix;
wechatUtil.mpPrefix = config.wechat.mpPrefix;*/
/*// 监听事件消息
weixin.eventMsg(function(msg) {
    console.log("eventMsg received");
    console.log(JSON.stringify(msg));
    var resMsg = {};
    if(msg.event === 'subscribe'){          //关注订阅号
        resMsg = {
            fromUserName : msg.toUserName,
            toUserName : msg.fromUserName,
            msgType : "text",
            content : "欢迎关注我们的订阅号",
            funcFlag : 0
        };
        weixin.sendMsg(resMsg);
    }
    if(msg.event === 'unsubscribe'){          //关注订阅号
        resMsg = {
            fromUserName : msg.toUserName,
            toUserName : msg.fromUserName,
            msgType : "text",
            content : "欢迎下次再来",
            funcFlag : 0
        };
        weixin.sendMsg(resMsg);
    }
});*/
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
    }

};
