var express = require('express');
var router = express.Router();

var userDao = require('../dao/userDao');

/* GET agents listing. */
router.get('/list', function(req, res, next) {
    //res.send('respond with a resource');
    res.render('agent/list', {title: '代理管理'});
});
/* GET agent add 打开添加页面. */
router.get('/add', function(req, res, next) {
  //res.send('respond with a resource');
    res.render('agent/admin', {title: '添加代理'});
});
/* GET agent edit 打开修改页面. */
router.get('/edit/:id', function(req, res, next) {
    //res.send('respond with a resource');
    res.render('agent/admin', {title: '修改代理'});
});


// 增加用户
//TODO 同时支持get,post
router.get('/addUser', function(req, res, next) {
    userDao.add(req, res, next);
});


router.get('/queryAll', function(req, res, next) {
    console.log('查询所有user');
    userDao.queryAll(req, res, next);
});

router.get('/query', function(req, res, next) {
    userDao.queryById(req, res, next);
});

router.get('/deleteUser', function(req, res, next) {
    userDao.delete(req, res, next);
});

router.post('/updateUser', function(req, res, next) {
    userDao.update(req, res, next);
});

module.exports = router;

