var express = require('express');
var router = express.Router();

var productDao = require('../dao/productDao');

/* GET products listing. */
router.get('/list', function(req, res, next) {
    productDao.queryAll(req, res, next);
});
/* GET products add 打开添加页面. */
router.get('/add', function(req, res, next) {
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
/* DELETE products edit 删除信息. */
router.delete('/delete/:id', function(req, res, next) {
    productDao.deleteById(req, res, next);
});
//TODO 同时支持get,post

module.exports = router;

