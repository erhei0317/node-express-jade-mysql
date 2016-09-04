// dao/userDao.js
// 实现与MySQL交互
var mysql = require('mysql');
var $conf = require('../conf/db');
var $util = require('../util/util');

//将数据库连接和操作的统一方法写在这里
module.exports = {
    jsonWrite : function (res, ret) {           // 向前台返回JSON方法的简单封装
        if(typeof ret === 'undefined') {
            res.json({
                code:'1',
                msg: '操作失败'
            });
        } else {
            res.json(ret);
        }
    },
    pool : mysql.createPool($util.extend({}, $conf.mysql))      // 使用连接池，提升性能
};
