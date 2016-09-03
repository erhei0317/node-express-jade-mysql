var express = require('express');
var router = express.Router();

var userDao = require('../dao/userDao');

/* GET deals in 打开进货页面. */
router.get('/in', function(req, res, next) {
  //res.send('respond with a resource');
    res.render('deal/in', {title: '进货'});
});
/* GET deals edit 打开出货页面. */
router.get('/out', function(req, res, next) {
    //res.send('respond with a resource');
    res.render('deal/out', {title: '出货'});
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

