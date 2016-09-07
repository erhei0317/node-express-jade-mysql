var express = require('express');
var router = express.Router();

var agencyDao = require('../dao/agencyDao');

/* GET agency listing. */
router.get('/list', function(req, res, next) {
    agencyDao.queryAll(req, res, next);
});
/* GET agency add 打开添加页面. */
router.get('/add', function(req, res, next) {
    agencyDao.openAdd(req, res, next);
});
router.post('/add', function(req, res, next) {
    agencyDao.add(req, res, next);
});
/* GET agency edit 打开修改页面. */
router.get('/edit/:id', function(req, res, next) {
    agencyDao.queryById(req, res, next);
});
/* GET agency edit 打开修改页面. */
router.post('/edit', function(req, res, next) {
    agencyDao.edit(req, res, next);
});


module.exports = router;

