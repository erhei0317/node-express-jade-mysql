// dao/userDao.js
// 实现与MySQL交互
var $sql = require('./wechatSqlMapping');
var $dbc = require('./dbCommon');
var wechatUtil = require('../util/wechatUtil');
var OAuth = require('wechat-oauth');            //微信网页授权
var config = require('../conf/config.json');
var weixin = require('weixin-api');
var qs = require('querystring');
var request = require('request');

weixin.token = config.wechat.token;
var client = new OAuth(config.wechat.appID, config.wechat.appSecret);

module.exports = {
    //验证微信服务器签名，及服务器配置的时候填写的接口验证
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
    },
    getWechatMsg: function (req, res, next) {
        //启动微信事件接收监听
        weixin.loop(req, res);
    },
    oauth: function (req, res, next) {
        var url = client.getAuthorizeURL('http://' + config.wechat.domain + '/wechat/oauthCallback','STATE','snsapi_userinfo');
        res.redirect(url)
    },
    oauthCallback: function (req, res, next) {
        var code = req.query.code;;
        client.getAccessToken(code, function(err, result) {  //根据code获取token
            var accessToken = result.data.access_token;
            var openid = result.data.openid;
            console.log('token:'+accessToken);
            $dbc.pool.getConnection(function(err, connection) {
                connection.query($sql.queryByOpenId, [openid], function(err, result) {
                    if(err){                                         //错误就返回给原post处 状态码为500的错误
                        res.send(500);
                        console.log(err);
                    }
                    if(result == ''){       //查询不到,说明还没有关注公众号
                        res.render('fail', {title: '没有关注公众号', msg: '您还没有关注我们的公众号哦，可搜索微信公众号“微商记账小能手”',  backUrl:''});      //当前id查询不到数据，返回数据异常页面
                    }else{
                        if(result[0].nickname){     //微信获取到的信息已经存入数据库中
                            res.redirect('../index')
                        }
                    };
                    connection.release();
                });
            });
        });
        //res.status(200).send(code);
    }

};

// 监听事件消息  关注和取消关注
weixin.eventMsg(function(msg) {
    var resMsg = {};
    var openId = msg.fromUserName;
    if(msg.event === 'subscribe'){          //关注订阅号
        resMsg = {
            fromUserName : msg.toUserName,
            toUserName : msg.fromUserName,
            msgType : "text",
            content : "猪猪霞早点休息，爱你，啵啵！",
            funcFlag : 0
        };
        weixin.sendMsg(resMsg);
        // 根据微信用户的openId从微信服务器上获取微信用户的基本信息
        wechatUtil.getAccessToken(function(accessToken){
            var queryParams = {
                'access_token': accessToken,
                'openid': openId,
                'lang':'zh_CN'
            };
            var wxGetUserInfoBaseUrl = wechatUtil.apiPrefix + 'user/info?' + qs.stringify(queryParams);
            var options = {
                method: 'GET',
                url: wxGetUserInfoBaseUrl
            };
            request(options, function (err, res, body) {
                body = JSON.parse(body);
                if (body) {
                    if(!body.errmsg){   //没有返回错误码，即获取用户信息成功
                        $dbc.pool.getConnection(function(err, connection) {
                            connection.query($sql.queryByOpenId, [openId], function(err, result) {   //查询openId是否存在，存在的话就更新数据库
                                console.log(result)
                                if(result&&result.length>0&&result[0].nickname){         //更新数据可的数据
                                    var editTime = new Date();
                                    var user = [editTime,body.nickname, body.sex, body.province, body.city, body.country, body.headimgurl,body.subscribe, body.subscribe_time, openId];
                                    console.log('update' + user);
                                    connection.query($sql.updateWxUser, user, function(err, result) {
                                        if(err){
                                            console.log(err);
                                        }
                                        if(result.affectedRows>0){          //插入成功的时候
                                            console.log('affectedRows');
                                        }
                                        if(result.changedRows>0){
                                            console.log('changedRows');
                                        }
                                        connection.release();           //用户关注订阅号后，将用户的openId存入数据库中
                                    });
                                }else{          //插入数据库数据
                                    var addTime = new Date();
                                    var editTime = addTime;
                                    var user = [openId, addTime, editTime,body.nickname, body.sex, body.province, body.city, body.country, body.headimgurl, body.subscribe_time,body.subscribe];
                                    console.log('insert' + user);
                                    connection.query($sql.addWxUser, user, function(err, result) {
                                        if(err){
                                            console.log(err);
                                        }
                                        if(result.affectedRows>0){          //插入成功的时候
                                            console.log('affectedRows');
                                        }
                                        if(result.changedRows>0){
                                            console.log('changedRows');
                                        }
                                        connection.release();           //用户关注订阅号后，将用户的openId存入数据库中
                                    });
                                }
                            });
                        });
                    }
                } else {
                    console.log('2'+err)
                    return err;
                }
            });
        });
    };
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
});
