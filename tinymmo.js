var http = require('http'),
    fs = require('fs'),
    io = require('socket.io'),

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

var socket = io.listen(server);
socket.on('connection', function(client) {
  client.pid = pid;
  client.x = Math.round(Math.random()*12);
  client.y = Math.round(Math.random()*6);
  pid++;

  client.send({t: "init", pid: client.pid});
  forEachClient(function(c) {
    updatePlayer(c);
  });

  function messageHandler(msg) {
    console.log("message: ", msg, "  ", client.pid);

    switch (msg.t) {
      case "move":
        client.x += msg.dx;
        client.y += msg.dy;
        forEachClient(function(c) { checkCollision(client, c); });
        updatePlayer(client);
        break;
    }
  }

  // new client is here!
  client.on('message', messageHandler);

  client.on('disconnect', function() { killPlayer(client); });
});
