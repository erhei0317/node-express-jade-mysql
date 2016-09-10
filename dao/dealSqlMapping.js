// dao/userSqlMapping.js
// CRUD SQL语句
var deal = {
    addOut:'INSERT IGNORE INTO orderOut(productName,agentName,count,userId,userName,price,totalPrice,realPrice,receipt,addTime, remark) VALUES(?,?,?,?,?,?,?,?,?,?,?)',
    addIn:'INSERT IGNORE INTO orderIn(productName,count,userId,userName,price,totalPrice,realPrice,receipt,addTime, remark) VALUES(?,?,?,?,?,?,?,?,?,?)',
    addProduct: 'INSERT IGNORE INTO product (name,userId,userName,addTime) values (?,?,?,?);',      //数据库中建立了name和userId的唯一索引，这里如果name和userId已存在的话将不会插入，影响行数为0，否则插入影响行数为1（insert ignore）
    addLevel: 'INSERT IGNORE INTO level (name,userId,userName,addTime) values (?,?,?,?);',
    queryAgentByUId: 'select name,productName,price from agent where userId=?',
    queryProductByUId: 'select name from product where userId=?',
    edit:'update ignore agent set name=?, productName=?, levelName=?, price=?, editTime=?, remark=? where id=? and userId=?',
    queryByName:'select userId from agent where name=? and userId=? and productName=?',
    queryById: 'select * from agent where id=? and userId=?',
    queryAll: 'select id,name,levelName,productName,userId,price,remark from agent where userId=?',
    delete: 'delete from agent where id=? and userId=?'
};

module.exports = deal;