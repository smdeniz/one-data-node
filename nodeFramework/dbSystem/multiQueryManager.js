var prp = multiQueryManager.prototype;


const db = require("./mainDatabase.js");

function multiQueryManager() {
    this.arrayDb = [];
}

prp.execMulti = function (arrayQuery,func) {

    var index = 0;

    var allResult = new Object();
    allResult.results = {};

    this.run(arrayQuery, index, allResult ,function (err) {

        if (err) {
            func(err);
        } else {
            func(null, allResult);
        }

    });

}

prp.run = function (arrayQuery, index, allResult,func) {

    var multiQueryManager_ = this;

    this.exec(arrayQuery[index], allResult, function (err, result, db) {

        if (err) {

            var baseErr = err;

            multiQueryManager_.rollback(0, function (err) {

                if (err) {
                    func(err);
                } else {
                    multiQueryManager_.close(0, function (err) {

                        if (err) {
                            func(err);
                        } else {
                            func(baseErr);
                        }
                    });
                }
            });
        } else {

            if (index == arrayQuery.length - 1) {

                multiQueryManager_.commit(0, function(err) {

                    if (err) {
                        func(err);
                    } else {
                        multiQueryManager_.close(0, function (err) {

                            if (err) {
                                func(err);
                            } else {
                                func(null);
                            }
                        });
                    }
                });

            } else {
                index++;


                multiQueryManager_.run(arrayQuery, index, allResult, func);
            }
        }
    });
}

prp.exec = function (params, allResult,func) {
    
    var dataBase = new db();

    this.arrayDb.push(dataBase);

    var data = new Object();

    data.result = null;

    data.dataBase = dataBase;

    allResult[params.key] = data;

    dataBase.clearInputValues();

    if (params.beforeExec) {
        params.beforeExec(allResult, dataBase);
    }
    
    dataBase.exec(params, function (err,result, db) {

        data.result = result;

        if (err) {
            func(err);
        } else {

            func(null, result, db);
        }
    });
}

prp.commit = function(index,func) {
    
    var dataBase = this.arrayDb[index];

    var multiQueryManager_ = this;

    dataBase.commit(function(err) {


        if (err) {
            func(err);
        } else {
            index++;

            if (index >= multiQueryManager_.arrayDb.length) {
                func();
            } else {
                multiQueryManager_.commit(index, func);
            }
        }

    });
}

prp.rollback = function (index, func) {

    var dataBase = this.arrayDb[index];

    var multiQueryManager_ = this;

    dataBase.rollback(function (err) {

        if (err) {
            func(err);
        } else {
            index++;

            if (index >= multiQueryManager_.arrayDb.length) {
                func();
            } else {
                multiQueryManager_.rollback(index, func);
            }
        }

    });
}

prp.close = function (index, func) {

    var dataBase = this.arrayDb[index];

    var multiQueryManager_ = this;

    dataBase.close(function (err) {

        if (err) {
            func(err);
        } else {
            index++;

            if (index >= multiQueryManager_.arrayDb.length) {
                func();
            } else {
                multiQueryManager_.close(index, func);
            }
        }

    });
}

module.exports = multiQueryManager;