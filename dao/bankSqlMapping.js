// dao/userSqlMapping.js
// CRUD SQL语句
var bank = {
    productBankKey:'INSERT IGNORE INTO bankKey(bankKey,addTime,isUse,isSale,owner,buyer) VALUES(?,?,?,?,?,?)',
};

module.exports = bank;