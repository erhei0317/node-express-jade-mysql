var express = require('express');
var router = express.Router();

/* GET home pages. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Welcome' });
});
router.get('/index', function(req, res, next) {
  res.render('index', { title: 'Welcome' });
});
//交易
router.get('/deal', function(req, res, next) {
  res.render('deal', { title: '交易' });
});
//管理
router.get('/manage', function(req, res, next) {
  res.render('manage', { title: '管理' });
});
//统计
router.get('/statistics', function(req, res, next) {
  res.render('statistics', { title: '统计' });
});


module.exports = router;
