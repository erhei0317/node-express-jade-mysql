// dao/userSqlMapping.js
// CRUD SQL语句
var bank = {
    productBankKey:'INSERT IGNORE INTO agent(name,levelName,productName,userId,userName,price,addTime,editTime, remark,wxOpenId) VALUES(?,?,?,?,?,?,?,?,?,?)',
};

module.exports = bank;