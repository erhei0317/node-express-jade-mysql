// dao/userSqlMapping.js
// CRUD SQL语句
var level = {
    add:'INSERT INTO level(name,productId,productName,userId,userName,price,addTime,editTime) VALUES(?,?,?,?,?,?,?,?)',
    queryProductByUId: 'select id,name from product where userId=?',
    edit:'update ignore level set name=?, productId=?, productName=?, price=?, editTime=? where id=? and userId=?',
    queryByName:'select userId from level where name=? and userId=? and productId=?',
    queryById: 'select id,name,productId,price from level where id=? and userId=?',
    queryAll: 'select id,name,productId,price from level where userId=?',
    delete: 'delete from level where id=? and userId=?',
};

module.exports = level;