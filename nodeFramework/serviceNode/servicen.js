var prp = servicen.prototype;

function servicen() {
    var ajaxManager = require("../ajaxSystem/ajaxManager.js");

    var ajaxManagerN = new ajaxManager();

    var servicen_ = this;

    ajaxManagerN.createAjaxServer(function(methodName,data,response) {

        response.end(JSON.stringify(servicen_[methodName](data)));

    }, { port: 8090 });
}


prp.met1 = function(data) {


    return data;
}


module.exports = servicen;