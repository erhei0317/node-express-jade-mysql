// dao/userDao.js
// 实现与MySQL交互
var $sql = require('./productSqlMapping');
var $dbc = require('./dbCommon');

module.exports = {
    add: function (req, res, next) {
        $dbc.pool.getConnection(function(err, connection) {
            var uId = req.session.uid;
            var uName = req.session.name;
            var addTime = new Date();
            var editTime = new Date();
            var param = req.body;       // 获取前台页面传过来的参数
            if(param.name == '' || parm.name == 'undefined') {      //产品名称为空
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
    }

    
};
