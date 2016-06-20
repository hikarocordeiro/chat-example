var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 8080;

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

/**
 * Returns a random integer between min (inclusive) and max (inclusive)
 * Using Math.round() will give you a non-uniform distribution!
 */
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });

  socket.on('roll message', function(msg){
    var dice = 0;

    if(msg == 'd6'){
      var dice = getRandomInt(1, 6);
    }
    io.emit('chat message', '<i><img src="https://db.tt/Upbap5C6" class="d6-dice-icon"/></i> = '+dice);
  });
});

http.listen(port, function(){
  console.log('listening on *:3000');
});