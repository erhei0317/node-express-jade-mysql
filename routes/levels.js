var express = require('express');
var router = express.Router();

var levelDao = require('../dao/levelDao');

/* GET levels listing. */
router.get('/list', function(req, res, next) {
    //res.send('respond with a resource');
    res.render('level/list', {title: '代理级别管理'});
});
/* GET levels add 打开添加页面. */
router.get('/add', function(req, res, next) {
  //res.send('respond with a resource');
    levelDao.queryProductByUId(req, res, next);
    //res.render('level/admin', {title: '添加代理级别'});
});
/* POST products add 提交新增的信息. */
router.post('/add', function(req, res, next) {
    levelDao.add(req, res, next);
});
/* GET levels edit 打开修改页面. */
router.get('/edit/:id', function(req, res, next) {
    //res.send('respond with a resource');
    res.render('level/admin', {title: '修改代理级别'});
});



module.exports = router;

