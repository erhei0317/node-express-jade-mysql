var express = require('express');
var router = express.Router();

var levelDao = require('../dao/levelDao');

/* GET levels listing. */
router.get('/list', function(req, res, next) {
    levelDao.queryAll(req, res, next);
});
/* GET levels add 打开添加页面. */
router.get('/add', function(req, res, next) {
    levelDao.openAdd(req, res, next);
});
/* POST products add 提交新增的信息. */
router.post('/add', function(req, res, next) {
    levelDao.add(req, res, next);
});
/* GET levels edit 打开修改页面. */
router.get('/edit/:id', function(req, res, next) {
    levelDao.queryById(req, res, next);
});
/* POST levels edit 打开修改页面. */
router.post('/edit', function(req, res, next) {
    levelDao.edit(req, res, next);
});


module.exports = router;

