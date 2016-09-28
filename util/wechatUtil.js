/**
 * Created by fujunou on 2015/3/6.
 */
'use strict';
var qs = require('querystring'),
config = require('../conf/config.json'),
fs = require('fs'),
request = require('request');


var WechatUtil = function() {
    this.appid = config.wechat.appID;
    this.secret = config.wechat.appSecret;
    this.apiPrefix = config.wechat.apiPrefix;
    this.mpPrefix = config.wechat.mpPrefix;
    this.timestamp = new Date().getTime();       //获取当前时间戳
};
//验证微信服务器签名，及服务器配置的时候填写的接口验证
/*WechatUtil.prototype.checkSignature = function(req) {
    return weixin.checkSignature(req)
};*/
// 从微信服务器上获取微信基础接口access_token
WechatUtil.prototype.getAccessTokenByService = function() {
    this.grant_type = 'client_credential';
    var queryParams = {
        'grant_type': this.grant_type,
        'appid': this.appid,
        'secret': this.secret
    };
    var wxGetAccessTokenBaseUrl = this.apiPrefix + 'token?' + qs.stringify(queryParams);
    var options = {
        method: 'GET',
        url: wxGetAccessTokenBaseUrl
    };
    return new Promise((resolve, reject) => {
            request(options, function (err, res, body) {
                if (res) {
                    resolve(JSON.parse(body));
                } else {
                    reject(err);
                }
            });
    });
};


//保存基础access_token到指定文件
WechatUtil.prototype.saveToken = function (callback) {
    this.getAccessTokenByService().then(res => {    //重新获取access_token , 这里面的也是异步的
        var msg = {
            access_token:res['access_token'],
            expires_in:parseInt(res['expires_in'])*1000+this.timestamp                  //将过期时间计算出来，保存起来，使用的时候比较当前时间与存入的时间，存入时间比较大则可以继续使用，否则重新获取
        };
        fs.writeFile('./token.json', JSON.stringify(msg), function (err) {});       //将数据写入指定文件
        callback(res['access_token']);
    });
};
//获取本地保存的access_token，如果还在有效期就直接使用，不在有效期就重新到微信服务器上获取
WechatUtil.prototype.getAccessToken = function (callback) {
    var _self = this;
    fs.readFile('./token.json',function(err, data){
        if(err){            //读取文件失败
            ('file not found');         //文件不存在
        }
        else{
            var jsonData = JSON.parse(data);
            if(jsonData.expires_in > _self.timestamp) {     //保存在文件的token还在有效期
                callback(jsonData.access_token);        //fs.readFile是异步请求，使用回调函数返回结果
            } else {            //已过有效期
                _self.saveToken(function(msg){      //重新获取access_token
                    callback(msg);          //通过回调函数返回
                });
            }
        }
    });
};

module.exports = new WechatUtil();