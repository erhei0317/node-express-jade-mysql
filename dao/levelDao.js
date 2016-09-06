// dao/userDao.js
// 实现与MySQL交互
var $sql = require('./levelSqlMapping');
var $dbc = require('./dbCommon');

module.exports = {
    add: function (req, res, next) {        //添加
        $dbc.pool.getConnection(function(err, connection) {
            var uId = req.session.uid;
            var uName = req.session.name;
            var addTime = new Date();
            var editTime = new Date();
            var param = req.body;       // 获取前台页面传过来的参数
            if(param.name == '' || param.name == 'undefined' || param.price == '' || param.price == 'undefined') {      //级别名称和价格为空
                var result = {
                    code: 3,
                    msg:'级别名称或价格不能为空'
                };
                $dbc.jsonWrite(res, result);        // 以json形式，把操作结果返回给前台页面
                connection.release();   // 释放连接
            } else {
                //查询级别名称是否存在
                connection.query($sql.queryByName, [param.name, uId], function(err, result) {
                    if(err){                                         //错误就返回给原post处（login.html) 状态码为500的错误
                        res.send(500);
                        console.log(err);
                    }
                    if(result.length>0&&result[0].userId == uId){        //记录已存在
                        result = {
                            code: 2,
                            msg:'记录已存在'
                        };
                        $dbc.jsonWrite(res, result);        // 以json形式，把操作结果返回给前台页面
                        connection.release();   // 释放连接
                    } else {        //记录不存在
                        // 建立连接，向表中插入数据
                        var sqlData = [param.name, param.productId, param.productName, uId, uName,param.price, addTime, editTime];
                        connection.query($sql.add, sqlData, function(err, result) {
                            if(err){                                         //错误就返回给原post处（login.html) 状态码为500的错误
                                res.send(500);
                                console.log(err);
                            }
                            if(result.affectedRows > 0){
                                result = {
                                    code: 200,
                                    msg:'增加成功'
                                };
                            }
                            $dbc.jsonWrite(res, result);    // 以json形式，把操作结果返回给前台页面
                            connection.release();   // 释放连接
                        });
                    }
                });
            }
        });
    },
    //根据uId查询产品列表
    queryProductByUId: function (req, res, next) {
        $dbc.pool.getConnection(function(err, connection) {
            var uId = req.session.uid;
            connection.query($sql.queryProductByUId, uId, function(err, result) {
                if(err){                                         //错误就返回给原post处 状态码为500的错误
                    res.send(500);
                    console.log(err);
                }
                result[0].name = '';
                res.render('level/admin', {title: '添加代理级别', result: result});   //如果查不到数据，那么result返回[]空数组
                connection.release();
            });
        });
    },
    edit: function (req, res, next) {        //修改
        $dbc.pool.getConnection(function(err, connection) {
            var editTime = new Date();
            var param = req.body;       // 获取前台页面传过来的参数
            if(param.name == '' || param.name == 'undefined' || param.price == '' || param.price == 'undefined') {      //级别名称和价格为空
                var result = {
                    code: 3,
                    msg:'级别名称或价格不能为空'
                };
                $dbc.jsonWrite(res, result);        // 以json形式，把操作结果返回给前台页面
                connection.release();   // 释放连接
            } else {
                //修改代理级别
                var sqlData = [param.name, param.productId, param.productName, param.price, editTime];
                connection.query($sql.edit, sqlData, function(err, result) {
                    if(err){                                         //错误就返回给原post处（login.html) 状态码为500的错误
                        res.send(500);
                        console.log(err);
                    }
                    console.log(result)
                    if(result.affectedRows > 0){
                        result = {
                            code: 200,
                            msg:'修改成功'
                        };
                    }else{
                        result = {
                            code: 2,
                            msg:'参数错误'
                        };
                    }
                    $dbc.jsonWrite(res, result);    // 以json形式，把操作结果返回给前台页面
                    connection.release();   // 释放连接
                });
            }
        });
    },
    //根据id查询
    queryById: function (req, res, next) {
        $dbc.pool.getConnection(function(err, connection) {
            var id = req.params.id;
            connection.query($sql.queryById, id, function(err, result) {
                if(err){                                         //错误就返回给原post处 状态码为500的错误
                    res.send(500);
                    console.log(err);
                }
                res.render('product/admin', {title: '修改产品', result: result});
                connection.release();
            });
        });
    },
    //查询全部
    queryAll: function (req, res, next) {
        $dbc.pool.getConnection(function(err, connection) {
            var uId = req.session.uid;
            connection.query($sql.queryAll, uId, function(err, result) {
                if(err){                                         //错误就返回给原post处 状态码为500的错误
                    res.send(500);
                    console.log(err);
                }
                res.render('product/list', {title: '产品管理', result: result});
                connection.release();
            });
        });
    },
    //根据id删除
    deleteById: function (req, res, next) {
        $dbc.pool.getConnection(function(err, connection) {
            var id = req.params.id;
            connection.query($sql.delete, id, function(err, result) {
                if(err){                                         //错误就返回给原post处 状态码为500的错误
                    res.send(500);
                    console.log(err);
                }
                if(result.affectedRows > 0) {
                    result = {
                        code: 200,
                        msg: '删除成功'
                    }
                }else{
                    result = {
                        code: 2,
                        msg: '删除失败'
                    }
                }
                console.log(result);
                 $dbc.jsonWrite(res, result);
                connection.release();
            });
        });
    }

    
};
