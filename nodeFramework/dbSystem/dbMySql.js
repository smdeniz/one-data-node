
"use strict";

var prp = dbMySql.prototype;

const sql = require("mysql");

function dbMySql(dataBase) {
    this.pool = null;
    this.transaction = null;
    this.dataBase = dataBase;
}

prp.exec = function (params, func) {

    if (this.pool == null) {
        this.createConnection(params, func);
    } else {
        this.run(params, func);
    }

}

prp.createConnection = function (params, func) {

    var dbMySql_ = this;

    this.pool = sql.createConnection(params.dataBase);

    this.pool.getConnection(function (err, connection) {

        if (err) {
            console.log(err);

            func(err);
        } else {

            this.connection = connection;

            dbMySql_.run(params, func);
        }
    });

  
    
}


prp.run = function (params, func) {

    if (params.isTransaction) {

        if (this.connection != null) {
       
            var dbMySql_ = this;

            this.connection.beginTransaction(function (err) {

                if (err) {
                    func(err);
                } else {
                    dbMySql_.queryRun(params, func);
                }
            });
        } else {
            func("connection nesnesi null olmaz.");
        }

    } else {
        this.queryRun(params, func);
    }

}


prp.queryRun = function (params, func) {


    if (params.isTransaction) {

        var hash = {};

        for (var i = 0; i < this.dataBase.inputValues.length; i++) {
            var inpt = this.dataBase.inputValues[i];

            hash[inpt[0]] = inpt[1];
        }

        this.connection.query(params.query, hash, function (err, result) {//fields ne olacak??
            if (err) {
                func(err);
            } else {
                func(null, result, params.db);
            }
        });

      
    } else {
        var hash = {};

        for (var i = 0; i < this.dataBase.inputValues.length; i++) {
            var inpt = this.dataBase.inputValues[i];

            hash[inpt[0]] = inpt[1];
        }

        this.connection.query(params.query, hash, function (err, result) {
            if (err) {
                func(err);
            } else {
                func(null, result, params.db);
            }
        });
    }
}

prp.commit = function (func) {

    if (this.connection != null) {

        this.connection.commit(function (err) {
            func(err);
        });
    } else {
        func();
    }
}

prp.rollback = function (func) {

    if (this.connection != null) {
        this.connection.rollback(function () {
            func();
        });
    } else {
        func();
    }
}

prp.close = function (func) {
    //Tüm bağlantılar kapatılıyor
    this.pool.end(function (err) {
        func(err);
    });
}



module.exports = dbMySql;