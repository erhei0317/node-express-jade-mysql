var express = require('express');
var router = express.Router();

var loginDao = require('../dao/loginDao');
var indexDao = require('../dao/indexDao');
var bankDao = require('../dao/bankDao');


/* GET home pages. */
router.get('/', function(req, res, next) {
  indexDao.getUserById(req, res, next);
});
router.get('/index', function(req, res, next) {
  indexDao.getUserById(req, res, next);
});
//交易首页
router.get('/deal', function(req, res, next) {
  res.render('deal', { title: '交易' });
});
//管理首页
router.get('/manage', function(req, res, next) {
  res.render('manage', { title: '管理' });
});
//统计首页
router.get('/statistics', function(req, res, next) {
  res.render('statistics', { title: '统计' });
});
//登录页面
router.get('/login', function(req, res, next) {
  res.render('login', { title: '登录' });
});
//登录的提交页面
router.post('/login', function(req, res, next) {
  loginDao.submit(req, res, next);
});
//操作失败页面
router.get('/fail', function(req, res, next) {
  var err = req.session.error;   //获取错误信息
  delete req.session.error;
  res.render('fail', { title:'操作异常', msg: err, backUrl:'/'});
});
//批量生成激活码，存入数据库中
router.get('/productBankKey', function(req, res, next) {
    bankDao.productBankKey(req, res, next);
});
//微信公众号帮助中心，问题列表
router.get('/help', function(req, res, next) {
  res.render('help/helpList', { title:'帮助中心', msg: ''});
});
//微信公众号帮助中心--如何激活银行账单生成
router.get('/helpActiveBill', function(req, res, next) {
  res.render('help/helpActiveBill', { title:'激活银行账单生成', msg: ''});
});
//微信公众号帮助中心--如何快速找到我们的公众号，添加到桌面快捷方式
router.get('/helpQuick', function(req, res, next) {
  res.render('help/helpQuick', { title:'添加到桌面', msg: ''});
});
//微信公众号帮助中心--如何使用银行账单生成功能
router.get('/helpUseBank', function(req, res, next) {
  res.render('help/helpUseBank', { title:'如何使用银行账单生成功能', msg: ''});
});

module.exports = router;
