﻿//var http = require('http');
//var port = process.env.port || 1337;
//http.createServer(function (req, res) {
//    res.writeHead(200, { 'Content-Type': 'text/plain' });
//    res.end('Hello World\n');
//}).listen(port);

module.exports = require("./nodeFramework");

//var frm = require("./nodeFramework");

////var servicen =new frm.servicen();

//var dbConfig = {
//    server: "ARGE54\\SQLEXPRESS",
//    database: "IsAkis",
//    user: "sa",
//    password: "Password1",
//    pool: {
//        max: 10,
//        min: 0,
//        idleTimeoutMillis: 30000
//    }
//};

//var multiQManager = new frm.multiQueryManager();

//var arrayQuery = [
//    {
//        dbConfig: dbConfig,
//        dbType: "mssql",
//        isTransaction: true,
//        key: "qKey1",
//        query: "select * from TestDB.dbo.Deneme where val = @val",
//        beforeExec: function (previousResults, dataBase) {

//            dataBase.addInputValue("val", "INT" , 10);

//        }
//    },
//    {
//        dbConfig: dbConfig,
//        dbType: "mssql",
//        isTransaction: false,
//        key:"qKey2",
//        query: "insert into TestDB.dbo.Deneme values(10)",
//        beforeExec: function (previousResults,dataBase) {
//            var recordset = previousResults.qKey1.result.recordset;
            
//        }
//    }
//];

//multiQManager.execMulti(arrayQuery, function (err, allResult) {

//    if (err) {
//        // ... error checks 
//    } else {
        
//    }
//});

