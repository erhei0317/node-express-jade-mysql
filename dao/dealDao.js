// dao/userDao.js
// 实现与MySQL交互
var $sql = require('./dealSqlMapping');
var $dbc = require('./dbCommon');

module.exports = {
    addOut: function (req, res, next) {        //添加
        $dbc.pool.getConnection(function(err, connection) {
            var uId = req.session.uid;
            var uName = req.session.name;
            var addTime = new Date();
            var param = req.body;       // 获取前台页面传过来的参数
            if(param.product == 0 || param.product == 'undefined' || param.agent == 0 || param.agent == 'undefined' || param.count == '' || param.count == 'undefined' || param.price == '' || param.price == 'undefined' || param.realPrice == '' || param.realPrice == 'undefined' || param.receipt == '' || param.receipt == 'undefined') {      //代理名称或者产品或者级别或者价格为空
                var result = {
                    code: 2,
                    msg:'代理名称、产品、数量、成交总额、已收款不能为空'
                };
                $dbc.jsonWrite(res, result);        // 以json形式，把操作结果返回给前台页面
                connection.release();   // 释放连接
            } else {
                //查询代理名称是否存在，同一个产品不能出现相同名字   查询语句中已经做了当前用户当前产品只能有一个相同的代理名称的限制，如果添加返回的影响行数是1，表示插入成功，如果是0，表示记录已存在
                // 建立连接，向表中插入数据
                var sqlData = [param.product, param.agent, param.count, uId, uName, param.price, param.totalPrice, param.realPrice, param.receipt, addTime, param.remark];
                connection.query($sql.addOut, sqlData, function(err, result) {         //异步的执行
                    if(err){                                         //错误就返回给原post处（login.html) 状态码为500的错误
                        res.send(500);
                        console.log(err);
                    }
                    if(result.affectedRows > 0){
                        result = {
                            code: 200,
                            msg:'增加成功'
                        };
                    }else{
                        result = {
                            code: 4,
                            msg:'其他错误'
                        };
                    }
                    $dbc.jsonWrite(res, result);    // 以json形式，把操作结果返回给前台页面
                    connection.release();   // 释放连接
                });
            }
        });
    },
    //打开添加页面，需要获取产品的信息，代理信息回填信息全部为空
    openAddOut: function (req, res, next) {
        var _self = this;
        _self.queryProductByUId(req, res, next, function(products){     //获取产品
            _self.queryAgentByUId(req, res, next, function(agents){       //获取等级
                res.render('deal/out', {title: '出货',  products: products, agents: agents});   //如果查不到数据，那么result返回[]空数组
            });
        });
    },
    addIn: function (req, res, next) {        //添加
        $dbc.pool.getConnection(function(err, connection) {
            var uId = req.session.uid;
            var uName = req.session.name;
            var addTime = new Date();
            var param = req.body;       // 获取前台页面传过来的参数
            if(param.product == 0 || param.product == 'undefined' || param.count == '' || param.count == 'undefined' || param.price == '' || param.price == 'undefined' || param.realPrice == '' || param.realPrice == 'undefined' || param.receipt == '' || param.receipt == 'undefined') {      //代理名称或者产品或者级别或者价格为空
                var result = {
                    code: 2,
                    msg:'产品、数量、成交总额、已收款不能为空'
                };
                $dbc.jsonWrite(res, result);        // 以json形式，把操作结果返回给前台页面
                connection.release();   // 释放连接
            } else {
                //查询代理名称是否存在，同一个产品不能出现相同名字   查询语句中已经做了当前用户当前产品只能有一个相同的代理名称的限制，如果添加返回的影响行数是1，表示插入成功，如果是0，表示记录已存在
                // 建立连接，向表中插入数据
                var sqlData = [param.product, param.count, uId, uName, param.price, param.totalPrice, param.realPrice, param.receipt, addTime, param.remark];
                connection.query($sql.add, sqlData, function(err, result) {         //异步的执行
                    if(err){                                         //错误就返回给原post处（login.html) 状态码为500的错误
                        res.send(500);
                        console.log(err);
                    }
                    if(result.affectedRows > 0){
                        result = {
                            code: 200,
                            msg:'增加成功'
                        };
                    }else{
                        result = {
                            code: 4,
                            msg:'其他错误'
                        };
                    }
                    $dbc.jsonWrite(res, result);    // 以json形式，把操作结果返回给前台页面
                    connection.release();   // 释放连接
                });
            }
        });
    },
    //打开添加页面，需要获取产品的信息，代理信息回填信息全部为空
    openAddIn: function (req, res, next) {
        var _self = this;
        _self.queryProductByUId(req, res, next, function(products){     //获取产品
            res.render('deal/in', {title: '进货',  products: products});   //如果查不到数据，那么result返回[]空数组
        });
    },
    //根据id查询
    queryById: function (req, res, next) {
        var _self = this;
        $dbc.pool.getConnection(function(err, connection) {
            var id = req.params.id;
            var uId = req.session.uid;
            _self.queryProductByUId(req, res, next, function(products){     //获取产品
                _self.queryLevelByUId(req, res, next, function(levels){       //获取等级
                    connection.query($sql.queryById, [id, uId], function(err, result) {
                        if(err){                                         //错误就返回给原post处 状态码为500的错误
                            res.send(500);
                            console.log(err);
                        }
                        if(result == ''){       //查询不到
                            res.render('fail', {title: '数据异常', msg: '数据异常，请联系管理员',  backUrl:'list'});      //当前id查询不到数据，返回数据异常页面
                        }else{
                            res.render('agency/admin', {title: '修改代理', result: result, products: products, levels: levels});
                        }
                        connection.release();
                    });
                });
            });
        });
    },
    edit: function (req, res, next) {        //修改
        var _self = this;
        $dbc.pool.getConnection(function(err, connection) {
            var uId = req.session.uid;
            var editTime = new Date();
            var param = req.body;       // 获取前台页面传过来的参数
            if(param.name == '' || param.name == 'undefined' || param.product == '' || param.product == 'undefined' || param.level == '' || param.level == 'undefined' || param.price == '' || param.price == 'undefined') {      //代理名称或者产品或者级别或者价格为空
                var result = {
                    code: 2,
                    msg:'代理名称、产品、代理级别、代理价格不能为空'
                };
                $dbc.jsonWrite(res, result);        // 以json形式，把操作结果返回给前台页面
                connection.release();   // 释放连接
            } else {
                //修改代理级别
                var sqlData = [param.name, param.product, param.level, param.price, editTime, param.remark, param.uid, uId];
                connection.query($sql.edit, sqlData, function(err, result) {
                    if(err){                                         //错误就返回给原post处（login.html) 状态码为500的错误
                        res.send(500);
                        console.log(err);
                    }
                    if(result.changedRows == 0){           //当前用户的当前产品已存在当前代理名称
                        result = {
                            code: 3,
                            msg:'代理名称已存在'
                        };
                    }else if(result.changedRows > 0){           //changedRows改变行数
                        result = {
                            code: 200,
                            msg:'增加成功'
                        };
                    }else{
                        result = {
                            code: 4,
                            msg:'其他错误'
                        };
                    }
                    $dbc.jsonWrite(res, result);    // 以json形式，把操作结果返回给前台页面
                    _self.addProduct(req, res, next);       //添加产品名称到数据库
                    _self.addLevel(req, res, next);         //添加代理级别到数据库
                    connection.release();   // 释放连接
                });
            }
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
    },
    //根据uId查询代理
    queryAgentByUId: function (req, res, next, fn) {
        $dbc.pool.getConnection(function(err, connection) {
            var uId = req.session.uid;
            connection.query($sql.queryAgentByUId, uId, function(err, result) {
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
    }
    
};
