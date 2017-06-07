var prp = dbMsSql.prototype;

const sql = require("mssql");

function dbMsSql(dataBase) {
    this.pool = null;
    this.transaction = null;
    this.dataBase = dataBase;
}

prp.exec = function(params, func) {

    if (this.pool == null) {
        this.createConnection(params, func);
    } else {
        this.run(params, func);
    }

}

prp.createConnection = function(params,func) {
    
    var dbMsSql_ = this;
    
    this.pool = new sql.ConnectionPool(params.dbConfig, function (err) {

        if (err) {
            console.log(err);

            func(err);
        } else {

            dbMsSql_.run(params, func);
        }
    });

    //this.pool.on('error', function (err) {
    //    // ... error handler 
    //});
}


prp.run = function (params, func) {

    if (params.isTransaction) {

        if (this.transaction == null) {
            this.transaction = new sql.Transaction(this.pool);

            var dbMsSql_ = this;

            this.transaction.begin(function(err) {

                if (err) {
                    func(err);
                } else {
                    dbMsSql_.queryRun(params, func);
                }
            });
        } else {
            this.queryRun(params, func);
        }

    } else {
        this.queryRun(params, func);
    }

}


prp.queryRun = function(params, func) {

    var request = null;

    if (params.isTransaction) {

        request = new sql.Request(this.transaction);

        for (var i = 0; i < this.dataBase.inputValues.length; i++) {
            var inpt = this.dataBase.inputValues[i];

            request.input(inpt[0], sql[inpt[2]], inpt[1]);
        }
        
        request.query(params.query, function(err, result) {
            if (err) {
                func(err);
            } else {
                func(null, result, params.db);
            }
        });
    } else {
        request = new sql.Request(this.pool);

        for (var i = 0; i < this.dataBase.inputValues.length; i++) {
            var inpt = this.dataBase.inputValues[i];

            request.input(inpt[0], sql[inpt[2]], inpt[1]);
        }

        request.query(params.query, function (err, result) {

            if (err) {
                func(err);
            } else {
                func(null, result,params.db);
            }
        });
    }
}

prp.commit = function (func) {

    if (this.transaction != null) {

        this.transaction.commit(function(err) {
            func(err);
        });
    } else {
        func();
    }
}

prp.rollback = function (func) {

    if (this.transaction != null) {
        this.transaction.rollback(function(err) {
            func(err);
        });
    } else {
        func();
    }
}

prp.close = function (func) {

    this.pool.close(function(err) {
        func(err);
    });
}



module.exports = dbMsSql;