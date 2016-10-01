var express = require('express');
var router = express.Router();

var wechatDao = require('../dao/wechatDao');

//进入银行选择列表
router.get('/bankList', function(req, res, next) {
    res.render('bank/bankList', { title: '选择银行' });
});
//进入平安银行微信公众号版
router.get('/pa', function(req, res, next) {
    res.render('bank/pa', { title: '验证信息' });
});
//进入广发银行APP
router.get('/gf', function(req, res, next) {
    res.render('bank/gf', { title: '交易明细' });
});
//进入农业银行APP--付款
router.get('/ny', function(req, res, next) {
    res.render('bank/ny', { title: '转账' });
});
//进入农业银行APP--交易列表
router.get('/nyl', function(req, res, next) {
    res.render('bank/nyl', { title: '借记卡明细' });
});
module.exports = router;

