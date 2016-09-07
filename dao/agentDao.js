// dao/userDao.js
// 实现与MySQL交互
var $sql = require('./agentSqlMapping');
var $dbc = require('./dbCommon');

module.exports = {
    add: function (req, res, next) {        //添加
        $dbc.pool.getConnection(function(err, connection) {
            var uId = req.session.uid;
            var uName = req.session.name;
            var addTime = new Date();
            var editTime = new Date();
            var param = req.body;       // 获取前台页面传过来的参数
            if(param.name == '' || param.name == 'undefined' || param.productId == '0' || param.levelId == '0') {      //代理名称或者产品或者级别为空
                var result = {
                    code: 3,
                    msg:'级别名称、产品、价格不能为空'
                };
                $dbc.jsonWrite(res, result);        // 以json形式，把操作结果返回给前台页面
                connection.release();   // 释放连接
            } else {
                //查询代理名称是否存在，同一个产品不能出现相同名字
                connection.query($sql.queryByName, [param.name, uId, param.productId], function(err, result) {
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
                        var sqlData = [param.name, param.levelId, param.levelName, param.productId, param.productName, uId, uName, addTime, editTime];
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
    //打开添加页面，需要获取产品的信息，回填信息全部为空
    openAdd: function (req, res, next) {
        var _self = this;
        _self.queryProductByUId(req, res, next, function(products){     //获取产品
            _self.queryLevelByUId(req, res, next, function(levels){       //获取等级
                var result = [{name: '', productId: '', levelId: ''}];      //回填的信息，添加的时候都是空的
                res.render('agent/admin', {title: '添加代理', result: result, products: products, levels: levels});   //如果查不到数据，那么result返回[]空数组
            });
        });
    },
    //根据id查询
    queryById: function (req, res, next) {
        var _self = this;
        $dbc.pool.getConnection(function(err, connection) {
            var uId = req.session.uid;
            var id = req.params.id;
            _self.queryProductByUId(req, res, next, function(products){
                connection.query($sql.queryById, [id,uId], function(err, result) {
                    if(err){                                         //错误就返回给原post处 状态码为500的错误
                        res.send(500);
                        console.log(err);
                    }
                    res.render('level/admin', {title: '修改代理级别', result: result, products: products});
                    connection.release();
                });
            });
        });
    },
    //根据uId查询代理等级
    queryLevelByUId: function (req, res, next, fn) {
        $dbc.pool.getConnection(function(err, connection) {
            var uId = req.session.uid;
            connection.query($sql.queryLevelByUId, uId, function(err, result) {
                if(err){                                         //错误就返回给原post处 状态码为500的错误
                    res.send(500);
                    console.log(err);
                }
                fn(result);
                connection.release();
            });
        });
    },
    //根据uId查询产品列表
    queryProductByUId: function (req, res, next, fn) {
        $dbc.pool.getConnection(function(err, connection) {
            var uId = req.session.uid;
            connection.query($sql.queryProductByUId, uId, function(err, result) {
                if(err){                                         //错误就返回给原post处 状态码为500的错误
                    res.send(500);
                    console.log(err);
                }
                fn(result);
                connection.release();
            });
        });
    },
    edit: function (req, res, next) {        //修改
        $dbc.pool.getConnection(function(err, connection) {
            var uId = req.session.uid;
            var editTime = new Date();
            var param = req.body;       // 获取前台页面传过来的参数
            if(param.name == '' || param.name == 'undefined' || param.price == '' || param.price == 'undefined') {      //级别名称和价格为空
                var result = {
                    code: 3,
                    msg:'级别名称、产品、价格不能为空'
                };
                $dbc.jsonWrite(res, result);        // 以json形式，把操作结果返回给前台页面
                connection.release();   // 释放连接
            } else {
                //修改代理级别
                var sqlData = [param.name, param.productId, param.productName, param.price, editTime, param.uid, uId];
                console.log(sqlData)
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
    //查询全部
    queryAll: function (req, res, next) {
        var _self = this;
        $dbc.pool.getConnection(function(err, connection) {
            var uId = req.session.uid;
            _self.queryProductByUId(req, res, next, function(backData){
                connection.query($sql.queryAll, uId, function(err, result) {
                    if(err){                                         //错误就返回给原post处 状态码为500的错误
                        res.send(500);
                        console.log(err);
                    }
                    res.render('level/list', {title: '代理级别管理', result: result, products: backData});
                    connection.release();
                });
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
