// dao/userSqlMapping.js
// CRUD SQL语句
var level = {
    add:'INSERT INTO level(name,productId,productName,userId,userName,price,addTime,editTime) VALUES(?,?,?,?,?,?,?,?)',
    queryProductByUId: 'select id,name from product where userId=?',
    edit:'update level set name=?, productId=?, productName=?, price=?, editTime=? where id=?',
    queryByName:'select * from level where name=? and userId=? and productId=?',
    queryById: 'select id,name,productId,price from level where id=?',
    queryAll: 'select id,name,productId,price from level where userId=?',
    delete: 'delete from level where id=?',
};

module.exports = level;