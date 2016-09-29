var express = require('express');
var router = express.Router();

var wechatDao = require('../dao/wechatDao');

//进入银行选择列表
router.get('/bankList', function(req, res, next) {
    res.render('bank/bankList', { title: '选择银行' });
});
//进入平安银行微信公众号版
router.get('/pingan', function(req, res, next) {
    res.render('bank/pingan', { title: '验证信息' });
});
/*router.get('/interface', function(req, res, next) {
    wechatDao.openAddIn(req, res, next);
});*/
module.exports = router;

