var prp = mainDatabase.prototype;

const dbMsSql = require("./dbMsSql.js");
const dbMySql = require("./dbMySql.js");

function mainDatabase() {
    this.con = null;
    this.inputValues = [];
}

prp.exec = function(params,func) {

    params.db = this;

    if (params.dbType == "mssql") {

       this.con = new dbMsSql(this);

       this.con.exec(params,func);

    } else if (params.dbType == "mysql") {

        this.con = new dbMySql(this);

        this.con.exec(params, func);

    }else {
        func(params.dbType + " tanımsız dbType");
    }
}

prp.commit = function(func) {
    this.con.commit(func);

}

prp.rollback = function (func) {

    this.con.rollback(func);
}

prp.close = function (func) {

    this.con.close(func);
}

prp.addInputValue = function(name,value,type) {
    this.inputValues.push([name, value, type]);
}

prp.clearInputValues = function () {
    this.inputValues = [];
}


module.exports = mainDatabase;