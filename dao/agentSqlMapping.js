// dao/userSqlMapping.js
// CRUD SQL语句
var agent = {
    add:'INSERT INTO agent(name,levelId,levelName,productId,productName,userId,userName,addTime,editTime) VALUES(?,?,?,?,?,?,?,?,?)',
    queryLevelByUId: 'select id,name,productId from level where userId=?',
    queryProductByUId: 'select id,name from product where userId=?',
    edit:'update level set name=?, productId=?, productName=?, price=?, editTime=? where id=?',
    queryByName:'select userId from agent where name=? and userId=? and productId=?',
    queryById: 'select * from agent where id=?',
    queryAll: 'select * from agent where userId=?',
    delete: 'delete from agent where id=?',
};

module.exports = agent;