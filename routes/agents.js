var express = require('express');
var router = express.Router();

var agentDao = require('../dao/agentDao');

/* GET agents listing. */
router.get('/list', function(req, res, next) {
    //res.send('respond with a resource');
    res.render('agent/list', {title: '代理管理'});
});
/* GET agent add 打开添加页面. */
router.get('/add', function(req, res, next) {
  //res.send('respond with a resource');
    agentDao.openAdd(req, res, next);
    //res.render('agent/admin', {title: '添加代理'});
});
/* GET agent edit 打开修改页面. */
router.get('/edit/:id', function(req, res, next) {
    //res.send('respond with a resource');
    res.render('agent/admin', {title: '修改代理'});
});


module.exports = router;

