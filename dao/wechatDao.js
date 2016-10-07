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
        var url = client.getAuthorizeURL('http://' + config.wechat.domain + '/wechat/oauthCallback','STATE','snsapi_base');
        res.redirect(url)
    },
    oauthCallback: function (req, res, next) {          //微信网页授权
        var code = req.query.code;
        client.getAccessToken(code, function(err, result) {  //根据code获取token
            var accessToken = result.data.access_token;
            var openid = result.data.openid;
            $dbc.pool.getConnection(function(err, connection) {
                connection.query($sql.queryByOpenId, [openid], function(err, result) {
                    if(err){                                         //错误就返回给原post处 状态码为500的错误
                        res.send(500);
                        console.log(err);
                    }
                    if(result == ''){       //查询不到,说明还没有关注公众号
                        res.render('fail', {title: '没有关注公众号', msg: '您还没有关注我们的公众号哦，可搜索微信公众号“微商记账小能手”',  backUrl:''});      //当前id查询不到数据，返回数据异常页面
                    }else{
                        if(result[0].subscribe==1){     //微信获取到的信息已经存入数据库中，并且是已关注
                            req.session.uid = result[0].id;
                            req.session.name = result[0].nickname;
                            req.session.openid = openid;
                            res.redirect('../index')
                        }else{
                            res.render('fail', {title: '没有关注公众号', msg: '您还没有关注我们的公众号哦，可搜索微信公众号“微商记账小能手”',  backUrl:''});      //当前id查询不到数据，返回数据异常页面
                        }
                    };
                    connection.release();
                });
            });
        });
        //res.status(200).send(code);
    },
    //生成银行账单的授权页面
    oauthBank: function (req, res, next) {
        var url = client.getAuthorizeURL('http://' + config.wechat.domain + '/wechat/oauthBankCallback','STATE','snsapi_base');
        res.redirect(url)
    },
    oauthBankCallback: function (req, res, next) {          //微信网页授权  生成银行账单的授权页面
        var code = req.query.code;
        client.getAccessToken(code, function(err, result) {  //根据code获取token
            var accessToken = result.data.access_token;
            var openid = result.data.openid;
            $dbc.pool.getConnection(function(err, connection) {
                connection.query($sql.checkBankByOpenId, [openid], function(err, result) {
                    if(err){                                         //错误就返回给原post处 状态码为500的错误
                        res.send(500);
                        console.log(err);
                    }
                    if(result == ''){       //查询不到,说明还没有关注公众号
                        res.render('fail', {title: '没有关注公众号', msg: '您还没有关注我们的公众号哦，可搜索微信公众号“微商记账小能手”',  backUrl:''});      //当前id查询不到数据，返回数据异常页面
                    }else{
                        if(result[0].tryTime > Date.now()/1000){   //试用期内
                            req.session.uid = result[0].id;
                            req.session.name = result[0].nickname;
                            req.session.openid = openid;
                            req.session.isBank = 1;      //是否支持使用银行账单生成模块
                            res.redirect('../bank/bankList');
                        }else{
                            if(result[0].subscribe==1){     //微信获取到的信息已经存入数据库中，并且是已关注
                                if(result[0].isBank==1){        //支持使用银行账单生成
                                    req.session.uid = result[0].id;
                                    req.session.name = result[0].nickname;
                                    req.session.openid = openid;
                                    req.session.isBank = result[0].isBank;      //是否支持使用银行账单生成模块
                                    res.redirect('../bank/bankList');
                                }else{
                                    res.render('fail', {title: '没有权限', msg: '您没有权限使用当前功能哦，请联系管理员购买激活码！',  backUrl:''});      //当前id查询不到数据，返回数据异常页面
                                }
                            }else{
                                res.render('fail', {title: '没有关注公众号', msg: '您还没有关注我们的公众号哦，可搜索微信公众号“微商记账小能手”',  backUrl:''});      //当前id查询不到数据，返回数据异常页面
                            }
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
    var openid = msg.fromUserName;
    if(msg.event === 'subscribe'){          //关注订阅号
        resMsg = {
            fromUserName : msg.toUserName,
            toUserName : msg.fromUserName,
            msgType : "text",
            content : "欢迎关注微商记账小能手。\n我们的“银行账单生成”功能已经上线咯，初次关注后您有24小时的试用时间，试用过后可以联系客服购买激活码，激活后可以继续使用。\n初次使用建议点击下方菜单“帮助中心”获取更多帮助，或者联系我们的客服，微信：clicli168_kf",
            funcFlag : 0
        };
        weixin.sendMsg(resMsg);
        // 根据微信用户的openid从微信服务器上获取微信用户的基本信息
        wechatUtil.getAccessToken(function(accessToken){
            var queryParams = {
                'access_token': accessToken,
                'openid': openid,
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
                            connection.query($sql.queryByOpenId, [openid], function(err, result) {   //查询openid是否存在，存在的话就更新数据库
                                if(result&&result.length>0&&result[0].id){         //openid已经存在，更新数据库的数据
                                    var editTime = new Date();
                                    var user = [editTime,body.nickname, body.sex, body.province, body.city, body.country, body.headimgurl,body.subscribe, body.subscribe_time, openid];
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
                                        connection.release();           //用户关注订阅号后，将用户的openid存入数据库中
                                    });
                                }else{          //插入数据库数据
                                    var addTime = new Date();
                                    var editTime = addTime;
                                    var tryTime = Date.now()/1000+24*60*60;   //试用时间24小时,不计算毫秒
                                    var user = [openid, addTime, editTime,body.nickname, body.sex, body.province, body.city, body.country, body.headimgurl, body.subscribe_time,body.subscribe,tryTime];
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
                                        connection.release();           //用户关注订阅号后，将用户的openid存入数据库中
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
        $dbc.pool.getConnection(function(err, connection) {
            connection.query($sql.queryByOpenId, [openid], function(err, result) {   //查询openid是否存在，存在的话就更新数据库
                if(result&&result.length>0&&result[0].id){         //取消关注的时候把subscribe字段重置为0
                    var user = [0, openid];
                    connection.query($sql.unsubscribe, user, function(err, result) {
                        if(err){
                            console.log(err);
                        }
                        if(result.affectedRows>0){          //插入成功的时候
                            console.log('affectedRows');
                        }
                        if(result.changedRows>0){
                            console.log('changedRows');
                        }
                        connection.release();           //用户关注订阅号后，将用户的openid存入数据库中
                    });
                }
            });
        });
    }
});
// 监听文本消息
weixin.textMsg(function(msg) {
    var resMsg = {};
    var text = msg.content;         //用户发送过来的文本信息
    var openid = msg.fromUserName;      //用户openid
    resMsg = {          // 返回文本消息
        fromUserName : msg.toUserName,
        toUserName : msg.fromUserName,
        msgType : "text",
        content : "客官，我不知道你在说什么！",
        funcFlag : 0
    };
    if(text.indexOf('银行账单生成')==0){
        var bankKey = text.split('银行账单生成')[1];      //获取银行账单生成激活码
        $dbc.pool.getConnection(function(err, connection) {     //查询用户是否已经激活过了
            connection.query($sql.checkBankByOpenId, [openid], function(err, result) {
                if(err){                                         //错误就返回给原post处 状态码为500的错误
                    resMsg.content = '好像出错了，请联系管理员哦';
                    weixin.sendMsg(resMsg);
                }else{
                    if(result == ''){       //查询不到,说明还没有关注公众号
                        resMsg.content = '您好像没有关注我们的公众号耶，您是怎么进来的？';      //当前id查询不到数据，返回数据异常页面
                        weixin.sendMsg(resMsg);
                    }else{
                        if(result[0].subscribe==1){     //微信获取到的信息已经存入数据库中，并且是已关注
                            if(result[0].isBank==1){        //支持使用银行账单生成
                                resMsg.content = '您已经激活过咯，不要重复激活！';      //已经激活
                                weixin.sendMsg(resMsg);
                            }else{
                                var useTime = new Date();
                                connection.query($sql.checkBankKey, [useTime,openid,bankKey], function(err, result) {
                                    if(result&&result.affectedRows>0){      //激活码可用
                                        connection.query($sql.activeBank, [bankKey,useTime,openid], function(err, result) {
                                            if(result&&result.affectedRows>0) {      //激活码可用
                                                resMsg.content = '恭喜您激活成功';      //激活成功
                                                weixin.sendMsg(resMsg);
                                            }else{
                                                resMsg.content = '激活失败，请联系管理员';      //激活失败
                                                weixin.sendMsg(resMsg);
                                            }
                                        });
                                    }else{
                                        resMsg.content = '激活失败，无效激活码或您的激活码已被使用，如果是新购激活码，请联系客服，客服微信：clicli168_kf';      //激活失败
                                        weixin.sendMsg(resMsg);
                                    }
                                });
                            }
                        }else{
                            resMsg.content = '您好像没有关注我们的公众号耶，您是怎么进来的？';      //当前id查询不到数据，返回数据异常页面
                            weixin.sendMsg(resMsg);
                        }
                    };
                }
                connection.release();
            });
        });
    }else{
        resMsg.content = '如果您想激活“银行账单生成”功能的话，请发送“银行账单生成+激活码”，如“银行账单生成8888888888”，其他问题请联系客服，客服微信：clicli168_kf';
        weixin.sendMsg(resMsg);
    }
});
