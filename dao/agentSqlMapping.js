// dao/userSqlMapping.js
// CRUD SQL语句
var agent = {
    add:'INSERT INTO agent(name,levelId,levelName,productId,productName,userId,userName,price,addTime,editTime) VALUES(?,?,?,?,?,?,?,?,?,?)',
    queryLevelByUId: 'select id,name,productId from level where userId=?',
    queryProductByUId: 'select id,name from product where userId=?',
    edit:'update level set name=?, productId=?, productName=?, price=?, editTime=? where id=?',
    queryByName:'select * from level where name=? and userId=? and productId=?',
    queryById: 'select * from level where id=?',
    queryAll: 'select * from level where userId=?',
    delete: 'delete from level where id=?',
};

module.exports = agent;