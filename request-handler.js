/* You should implement your request handler function in this file.
 * But you need to pass the function to http.createServer() in
 * basic-server.js.  So you must figure out how to export the function
 * from this file and include it in basic-server.js. Check out the
 * node module documentation at http://nodejs.org/api/modules.html. */

var defaultCorsHeaders = require("./lib/cors.js").defaultCorsHeaders;
// var messages = require("./message-store.js");
var fs = require("fs");
var _ = require("underscore");

var messagesObject = {
  list: [],

  getMessages: function(){
    var messages = fs.readFileSync('message-log.json', 'utf8').split('\n');
    console.log(messages);
    var that = this;
    _.each(messages, function(message){
      that.list.push(JSON.parse(message));
    });
  },

  writeToFile: function(newMessage){
    fs.appendFile('message-log.json', newMessage, 'utf8');
  }
};

messagesObject.getMessages();
console.log(Array.isArray(messagesObject.list));

var createResponse = function(code, response){
  var statusCode = code;
  var headers = defaultCorsHeaders();
  headers['Content-Type'] = "text/plain";
  response.writeHead(statusCode, headers);

  return response;
};

var handlePostRequest = function(request, response) {
  if(request.url === "/1/classes/messages"){
    request.on('data', function(chunk) {
      request.content = '';
      request.content += chunk.toString();
    });
    
    request.on('end', function() {
      var msg = JSON.parse(request.content);
      messagesObject.list.push(msg);
      messagesObject.writeToFile("\n" + request.content);
      response = createResponse(200, response);
      response.end();
    });
  }
};

var handleGetRequest = function(request, response){
  if(request.url === "/1/classes/messages"){
    response = createResponse(200, response);
    response.write(JSON.stringify(messagesObject.list));
    response.end();
  }
};
 
exports.handlePostRequest = handlePostRequest;
exports.handleGetRequest = handleGetRequest;