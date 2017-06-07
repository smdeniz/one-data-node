# OneDataNode

Multi DB Server client for Node.js

## Quick Example

```javascript
var frm = require("one-data-node");

var dbConfig = {
    server: 'localhost', // You can use 'localhost\\instance' to connect to named instance,
    database: "...",
    user: "...",
    password: "...",
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
    }
};

var multiQManager = new frm.multiQueryManager();

var arrayQuery = [
    {
        dbConfig: dbConfig,
        dbType: "mssql",
        isTransaction: true,
        key: "qKey1",
        query: "select * from mytable where val = @val",
        beforeExec: function (previousResults, dataBase) {

            dataBase.addInputValue("val", "INT" , 10);

        }
    },
    {
        dbConfig: dbConfig,
        dbType: "mssql",
        isTransaction: false,
        key:"qKey2",
        query: "insert into mytable values(10)",
        beforeExec: function (previousResults,dataBase) {
            var recordset = previousResults.qKey1.result.recordset;
            
        }
    }
];

multiQManager.execMulti(arrayQuery, function (err, allResult) {

    if (err) {
        // ... error checks 
    } else {
        
    }
});
```
