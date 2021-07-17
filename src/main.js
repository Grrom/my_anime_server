"use strict";
var http = require('http');
var hostname = '127.0.0.1';
var port = 3000;
http.createServer(function (request, response) {
    console.log("got a request");
    switch (request.url) {
        case "/":
            response.writeHead(200, { "Content-Type": "text/html" });
            response.write("home");
            break;
        default:
            response.writeHead(200, { "Content-Type": "text/html" });
            response.write("not home");
    }
    response.end();
}).listen(port, hostname, function () {
    console.log("Server running at http://" + hostname + ":" + port + "/");
});
