var express = require('express');
var router = express.Router();

var productDao = require('../dao/productDao');

/* GET products listing. */
router.get('/list', function(req, res, next) {
   // res.render('product/list', {title: '产品管理'});
    productDao.queryAll(req, res, next);
});
/* GET products add 打开添加页面. */
router.get('/add', function(req, res, next) {
  //res.send('respond with a resource');
    res.render('product/admin', {title: '添加产品', result:[{
        id: '',
        name: '',
        remark: ''
    }]});
});
/* POST products add 提交新增的信息. */
router.post('/add', function(req, res, next) {
    productDao.add(req, res, next);
});
/* GET products edit 打开修改页面. */
router.get('/edit/:id', function(req, res, next) {
    //res.send('respond with a resource');
    productDao.queryById(req, res, next);
});
/* POST products edit 修改信息. */
router.post('/edit', function(req, res, next) {
    productDao.edit(req, res, next);
});
/*// 增加用户
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
});*/

module.exports = router;

