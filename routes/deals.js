var express = require('express');
var router = express.Router();

var dealDao = require('../dao/dealDao');

/* GET deals in 打开进货页面. */
router.get('/in', function(req, res, next) {
    res.render('deal/in', {title: '进货'});
});
/* GET deals edit 打开出货页面. */
router.get('/out', function(req, res, next) {
    dealDao.openAddOut(req, res, next);
});
/* POST deals edit 打开出货页面. */
router.post('/in', function(req, res, next) {
    dealDao.addIn(req, res, next);
});
/* POST deals edit 打开出货页面. */
router.post('/out', function(req, res, next) {
    dealDao.addOut(req, res, next);
});


module.exports = router;

