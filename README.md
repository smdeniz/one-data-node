# OneDataNode

Multi DB Server client for Node.js

*GitHub: [OneDataNode][]

[OneDataNode]: https://github.com/smdeniz/one-data-node

## Quick Example

```javascript
var frm = require("one-data-node");

var dbConfigMsSql = {
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

var dbConnfigMySql = {
  host     : 'localhost',
  user     : 'me',
  password : 'secret',
  database : 'my_db'
};

var multiQManager = new frm.multiQueryManager();

var arrayQuery = [
    {
        dbConfig: dbConfigMsSql,
        dbType: "mssql",
        isTransaction: true,
        key: "qKey1",
        query: "select * from mytable where val = @val",
        beforeExec: function (previousResults, dataBase) {

            dataBase.addInputValue("val", 10, "INT" );

        }
    },
    {
        dbConfig: dbConfigMsSql,
        dbType: "mssql",
        isTransaction: false,
        key:"qKey2",
        query: "insert into mytable values(10)",
        beforeExec: function (previousResults,dataBase) {
            var recordset = previousResults.qKey1.result.recordset;
            
        }
    },
    {
        dbConfig: dbConfigMySql,
        dbType: "mysql",
        isTransaction: false,
        key:"qKey3",
        query: "select * from mytable where val = :val",
        beforeExec: function (previousResults, dataBase) {

            dataBase.addInputValue("val", 12 );

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

## Examples

### Pass a parameter from one query to another

```javascript
var frm = require("one-data-node");

var dbConfigMsSql = {
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

var dbConnfigMySql = {
  host     : 'localhost',
  user     : 'me',
  password : 'secret',
  database : 'my_db'
};

var multiQManager = new frm.multiQueryManager();

var arrayQuery = [
    {
        dbConfig: dbConfigMsSql,
        dbType: "mssql",
        isTransaction: true,
        key: "qKey1",
        query: "select * from mytable",
        beforeExec: function (previousResults, dataBase) {

        }
    },
    {
        dbConfig: dbConfigMsSql,
        dbType: "mssql",
        isTransaction: false,
        key:"qKey2",
        query: "insert into mytable values(@val)",
        beforeExec: function (previousResults,dataBase) {
            var recordset = previousResults.qKey1.result.recordset;
            
			if(recordset.length > 0)
			{
              dataBase.addInputValue("val", recordset[0].val, "INT" ); //recordset[index].[columnName]
			}
        }
    },
    {
        dbConfig: dbConfigMySql,
        dbType: "mysql",
        isTransaction: false,
        key:"qKey3",
        query: "select * from mytable where val = :val",
        beforeExec: function (previousResults, dataBase) {

            dataBase.addInputValue("val", 12 );

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



