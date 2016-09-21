/**
 * Created by fujunou on 2015/3/6.
 */
'use strict';
var qs = require('querystring');
var fs = require('fs');
var request = require('request');

var wechatUtil = function() {
    this.appid = '';
    this.secret = '';
    this.apiPrefix = '';
    this.mpPrefix = '';
};

// 获取微信基础接口access_token
wechatUtil.prototype.getAccessToken = function() {
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
wechatUtil.prototype.saveToken = function () {
    this.getAccessToken().then(res => {
        var msg = {
            access_token:res['access_token'],
            expires_in:res['expires_in']
        };
        fs.writeFile('./token', JSON.stringify(msg), function (err) {
        });
    });
};
//更新基础access_token
wechatUtil.prototype.refreshToken = function () {
    this.saveToken();
    /*setInterval(function () {
        this.saveToken();
    }, 7000*1000);*/
};

module.exports = new wechatUtil();