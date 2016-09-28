var express = require('express');
var router = express.Router();

var loginDao = require('../dao/loginDao');
var indexDao = require('../dao/indexDao');

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

module.exports = router;
