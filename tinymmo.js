var http = require('http'),
    fs = require('fs'),
    io = require('socket.io'),
    world = require('./world.js'),

server = http.createServer(function(req, res){
 // your normal server code
 res.writeHead(200, {'Content-Type': 'text/html'});
 fs.readFile('index.html', function(err, data) {
   if (err) throw err;
   res.end(data);
 });
});
server.listen(8080);



//function makeMessage(t, args) { return {t:t }

function updatePlayer(client) {
  client.listener.broadcast({t: "updatePlayer", pid: client.pid, x: client.x, y: client.y });
}

function killPlayer(client) {
  client.listener.broadcast({t: "killPlayer", pid: client.pid });
}

// socket.io
var pid = 1;

function forEachClient(func) {
  Object.keys(socket.clients).forEach(function(k) { func(socket.clients[k])} );
}


function checkCollision(movedClient, client) {
  if (client === movedClient) { return; }

  if (client.x === movedClient.x && client.y === movedClient.y) {
    killPlayer(client);
    killPlayer(movedClient);
  }

  //console.log(movedClient.pid, "   ", client.pid);
}

// client actions
var actions = {
  "move" : function(client, msg) {
    var newX = client.x + msg.dx,
        newY = client.y + msg.dy;
    if (world.isEmpty(newX,newY)) {
      client.x = newX;
      client.y = newY;
      forEachClient(function(c) { checkCollision(client, c); });
      updatePlayer(client);
    }
    // TODO: handle the other item types
  }
};

function messageHandler(client, msg) {
  console.log('Received: '+msg.t+' from client:'+client.pid);
  if (msg.t in actions) {
    actions[msg.t](client, msg);
  } else {
    console.error("unknown message type: ", msg);
  }
}

var socket = io.listen(server);

// New client connects
socket.on('connection', function(client) {
  client.pid = pid;
  world.setStartPosition(client);
  pid++;

  client.send({t: "init", pid: client.pid, map:world.map});
  forEachClient(function(c) {
    updatePlayer(c);
  });

  client.on('message', function(m) { messageHandler(client,m); });

  client.on('disconnect', function() { killPlayer(client); });
});
