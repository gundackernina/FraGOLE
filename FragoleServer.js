/* Implements a simple Webserver for delivering the Contents of the Framework
to the connected clients
*/
var express = require('express');
var cookieParser = require('cookie-parser');
var http = require('http')
var Eureca = require('eureca.io');
var pug = require('pug');
var path = require('path');

class HTTP {
  constructor(port) {
    var app = express(app);
    app.set('views', './views');
    app.set('view engine', 'pug');
    app.locals.pretty = true;

    // serve static files like css from 'public' directory
    app.use(express.static(path.join(__dirname,'public')));
    app.use(express.static(path.join(__dirname,'semantic/dist')));

    app.use(cookieParser());

    // display index page
    app.get('/', function(request, response) {
      var playername;
      if (playername = request.query['playername']) {
        response.cookie('fragole' , playername)

      } else if (!request.cookies['fragole'])  {
          response.render('index_register');
          return;
      }
    
      response.render('index');

    });

    app.get('/:playername', function(request, response) {

    });

    app.listen(port, function() {
      console.log("WebServer listening at port " + port)
    });
  }
}

class RPC {

  constructor(port) {
    var server = http.createServer();

    this.connections = {}
    var connections = this.connections;

    this.eurecaServer = new Eureca.Server({allow:['setBackgroundColor', 'test']});
    this.eurecaServer.attach(server);

    this.eurecaServer.onConnect ( function (connection) {
         connections[connection.id] = connection.clientProxy;
         console.log(connections);
    });

    server.listen(port, function() {
      console.log("RPC listening at port " + port)
    });
  }

  connect(name, func) {
    this.eurecaServer.exports[name] = func;
  }
}

module.exports.HTTP = HTTP;
module.exports.RPC = RPC;
