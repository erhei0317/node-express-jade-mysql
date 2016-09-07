// dao/userDao.js
// 实现与MySQL交互
var $sql = require('./productSqlMapping');
var $dbc = require('./dbCommon');

module.exports = {
    add: function (req, res, next) {        //添加
        $dbc.pool.getConnection(function(err, connection) {
            var uId = req.session.uid;
            var uName = req.session.name;
            var addTime = new Date();
            var editTime = new Date();
            var param = req.body;       // 获取前台页面传过来的参数
            if(param.name == '' || param.name == 'undefined') {      //产品名称为空
                var result = {
                    code: 3,
                    msg:'产品名称不能为空'
                };
                $dbc.jsonWrite(res, result);        // 以json形式，把操作结果返回给前台页面
                connection.release();   // 释放连接
            } else {
                //查询产品名称是否存在
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
                        connection.query($sql.add, [param.name, param.remark, uId, uName, addTime, editTime], function(err, result) {
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
    edit: function (req, res, next) {        //修改
        $dbc.pool.getConnection(function(err, connection) {
            var uId = req.session.uid;
            var editTime = new Date();
            var param = req.body;       // 获取前台页面传过来的参数
            if(param.name == '' || param.name == 'undefined') {      //产品名称为空
                var result = {
                    code: 3,
                    msg:'产品名称不能为空'
                };
                $dbc.jsonWrite(res, result);        // 以json形式，把操作结果返回给前台页面
                connection.release();   // 释放连接
            } else {
                //修改产品
                connection.query($sql.edit, [param.name, param.remark, editTime, param.uid, uId], function(err, result) {
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
            var uId = req.session.uid;
            var id = req.params.id;
            connection.query($sql.queryById, [id,uId], function(err, result) {
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
            var uId = req.session.uid;
            var id = req.params.id;
            connection.query($sql.delete, [id,uId], function(err, result) {
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
