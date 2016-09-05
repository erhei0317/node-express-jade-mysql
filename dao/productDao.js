// dao/userDao.js
// 实现与MySQL交互
var $sql = require('./productSqlMapping');
var $dbc = require('./dbCommon');

module.exports = {
    add: function (req, res, next) {
        $dbc.pool.getConnection(function(err, connection) {
            // 获取前台页面传过来的参数
            var param = req.body;
            // 建立连接，向表中插入数据
            connection.query($sql.add, [param.name, param.remark], function(err, result) {
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
                // 以json形式，把操作结果返回给前台页面
                $dbc.jsonWrite(res, result);
                // 释放连接 
                connection.release();
            });
        });
    }

    
};
