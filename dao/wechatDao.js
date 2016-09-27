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
                        }else{      //微信获取到的信息还没存入数据库
                            client.getUser(openid, function (err, result) {
                                console.log('use weixin api get user: ' + err)
                                if(!result.errmsg){      //请求微信接口成功
                                    var editTime = new Date();
                                    var oauth_user = [result.nickname, result.sex, result.province, result.city, result.country, result.headimgurl, result.unionid,editTime, openid];
                                    connection.query($sql.updateWxUser, oauth_user, function(err, result) {
                                        if(err){                                         //错误就返回给原post处 状态码为500的错误
                                            res.send(500);
                                            console.log(err);
                                        }else{
                                            console.log('存入数据库 ')
                                            res.redirect('../index');
                                        }
                                    });
                                }else{          //请求微信接口失败
                                    res.render('fail', {title: '无法获取用户信息', msg: '无法获取您的信息，请稍后重试',  backUrl:''});      //无法从微信那边获取到数据
                                }
                            });
                        }
                    };
                    connection.release();
                });
            });
        });
        //res.status(200).send(code);
    }

};
