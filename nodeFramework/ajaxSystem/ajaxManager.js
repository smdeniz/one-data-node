var prp = ajaxManager.prototype;

function ajaxManager() {
  
}

prp.createAjaxServer  = function(func, config) {

    var port = config.port;
var http = require("http");
var server = http.createServer();
server.on('request', request);
server.listen(port);
function request(request, response) {
    var store = null;

    var buffer = request.url.split("/");

    var methodName = buffer[buffer.length - 1];

    //query = url_parts.query;

    //switch (buffer[buffer.length - 1]) {
    //    case 'login':
    //        // do something
          
    //        break;
    //}

    request.on('data', function (data) {

        if (store == null) store = data;
        else {
            var newStore = new Uint8Array(store.length +data.length);
            newStore.set(store);
            newStore.set(b, stroke.length);
        }
    });


    request.on('end', function () {

        var dt = JSON.parse(store);

        console.log(store);
        response.setHeader("Content-Type", "text/json");
        response.setHeader("Access-Control-Allow-Origin", "*");
        //response.end(JSON.stringify(dt));
        
        func(methodName, dt, response);
    });
}  

}

module.exports = ajaxManager;