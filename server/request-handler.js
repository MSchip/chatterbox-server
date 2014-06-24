/* You should implement your request handler function in this file.
 * And hey! This is already getting passed to http.createServer()
 * in basic-server.js. But it won't work as is.
 * You'll have to figure out a way to export this function from
 * this file and include it in basic-server.js so that it actually works.
 * *Hint* Check out the node module documentation at http://nodejs.org/api/modules.html. */
var url = require('url');
var qs = require('querystring');
var results = [];

module.exports.handleRequest = function(request, response) {
  var statusCode;
  var headers = defaultCorsHeaders;
  headers['Content-Type'] = "text/plain";
  var responseBody = "Not found";
  var urls = {
    '/classes/chatterbox': true,
    '/classes/messages': true,
    '/log': true,
    '/classes/room1' : true,
    '/' : true
  };

  console.log("Serving request type " + request.method + " for url " + request.url);
  var pathname = url.parse(request.url).pathname;

  if (!urls.hasOwnProperty(pathname)) {
    statusCode = 404;
  } else if (request.method === "OPTIONS") {
    headers['Content-Type'] = "text/plain";
    statusCode = 200;
    responseBody = "GET, POST, PUT, DELETE";
    console.log("You idiot");
  } else if (request.method === "GET") {
    console.log("Getting!!! from " + results);
    statusCode = 200;
    headers['Content-Type'] = "application/json";
    var messages = JSON.stringify({results: results});
    console.log(messages);
    responseBody = messages;
  } else if (request.method === "POST") {
    console.log("Posting to " + results);
    headers['Content-Type'] = "text/plain";
    statusCode = 201;
    var output = '';
    request.on('data', function (chunk) {
      output += chunk;
    });
    request.on('end', function () {
      // var decodedBody = JSON.parse(output.replace(/\bNaN\b/g, "null"));
      var decodedBody = JSON.parse(output);
      results.push(decodedBody);
      responseBody = 'OK';
    });
  }
  response.writeHead(statusCode, headers);
  response.end(responseBody);
};

module.exports.handler = module.exports.handleRequest;

/* These headers will allow Cross-Origin Resource Sharing (CORS).
 * This CRUCIAL code allows this server to talk to websites that
 * are on different domains. (Your chat client is running from a url
 * like file://your/chat/client/index.html, which is considered a
 * different domain.) */
var defaultCorsHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-headers": "Origin, X-Requested-With, Content-Type, Accept",
  "access-control-allow-methods": "GET, POST, OPTIONS",
  "access-control-max-age": 10 // Seconds.
};
