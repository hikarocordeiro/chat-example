var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 8080;

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });

  /*socket.on('roll message', function(msg){
    var dice = 1;
    if(msg == 'd6'){
      dice = Math.floor(Math.random() * (6 - 1)) + 1;
    }
    io.emit('chat message', '1d6 = '+dice);
  });*/
});

http.listen(port, function(){
  console.log('listening on *:3000');
});