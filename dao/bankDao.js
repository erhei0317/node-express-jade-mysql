// 实现与MySQL交互
var $sql = require('./agencySqlMapping');
var $dbc = require('./dbCommon');

module.exports = {
    productBankKey: function (req, res, next) {        //添加
        var _self = this;
        $dbc.pool.getConnection(function(err, connection) {
            var addTime = new Date();
            var param = req.query;       // 获取前台页面传过来的参数
            console.log(req.query);
            res.render('fail', {title: '生成失败', msg: req.query.count,  backUrl:''});    
            return false;
            if(param.name == '' || param.name == 'undefined') {      //代理名称或者产品或者级别或者价格为空
                res.render('fail', {title: '生成失败', msg: '参数错误',  backUrl:''});      //参数错误，返回数据异常页面
                connection.release();   // 释放连接
            } else {
                var sqlData = [param.name, param.level, param.product, uId, uName, param.price, addTime, editTime, param.remark, openid];
                connection.query($sql.productBankKey, sqlData, function(err, result) {         //异步的执行
                    if(err){                                         //错误就返回给原post处（login.html) 状态码为500的错误
                        res.send(500);
                        console.log(err);
                    }else{
                        if(result.affectedRows == 0){       //affectdRows影响行数
                            res.render('fail', {title: '生成失败', msg: '数据库插入失败',  backUrl:''});      //参数错误，返回数据异常页面
                        }else if(result.affectedRows > 0){
                            res.render('fail', {title: '生成成功', msg: '成功生成'+result.affectedRows+'条记录！',  backUrl:''});  
                        }else{
                            res.render('fail', {title: '生成失败', msg: '未知错误',  backUrl:''});  
                        }
                    }        
                    connection.release();   // 释放连接
                });
            }
        });
    }

    
};
