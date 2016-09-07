// dao/userSqlMapping.js
// CRUD SQL语句
var agent = {
    add:'INSERT INTO agent(name,levelId,levelName,productId,productName,userId,userName,addTime,editTime) VALUES(?,?,?,?,?,?,?,?,?)',
    queryLevelByUId: 'select id,name,productId from level where userId=?',
    queryProductByUId: 'select id,name from product where userId=?',
    edit:'update ignore level set name=?, productId=?, productName=?, price=?, editTime=? where id=? and userId=?',
    queryByName:'select userId from agent where name=? and userId=? and productId=?',
    queryById: 'select id,name,levelName,productName,userId,price from agent where id=? and userId=?',
    queryAll: 'select * from agent where userId=?',
    delete: 'delete from agent where id=? and userId=?',
};

module.exports = agent;