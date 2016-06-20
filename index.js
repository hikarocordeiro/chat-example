var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 8080;

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

///**
// * Returns a random integer between min (inclusive) and max (inclusive)
// * Using Math.round() will give you a non-uniform distribution!
// */
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
//
//io.on('connection', function(socket){
//  socket.on('chat message', function(msg){
//    io.emit('chat message', msg);
//  });
//
//  socket.on('roll message', function(msg){
//    var dice = 0;
//
//    if(msg == 'd6'){
//      var dice = getRandomInt(1, 6);
//    }
//    io.emit('chat message', '<i><img src="https://db.tt/Upbap5C6" class="d6-dice-icon"/></i> = '+dice);
//  });
//});
// Chatroom

var numUsers = 0;

io.on('connection', function (socket) {
  var addedUser = false;

  // when the client emits 'new message', this listens and executes
  socket.on('new message', function (data) {
    // we tell the client to execute 'new message'
    socket.broadcast.emit('new message', {
      username: socket.username,
      message: data
    });
  });

  // when the client emits 'add user', this listens and executes
  socket.on('add user', function (username) {
    if (addedUser) return;

    // we store the username in the socket session for this client
    socket.username = username;
    ++numUsers;
    addedUser = true;
    socket.emit('login', {
      numUsers: numUsers
    });
    // echo globally (all clients) that a person has connected
    socket.broadcast.emit('user joined', {
      username: socket.username,
      numUsers: numUsers
    });
  });

  // when the client emits 'typing', we broadcast it to others
  socket.on('typing', function () {
    socket.broadcast.emit('typing', {
      username: socket.username
    });
  });

  // when the client emits 'stop typing', we broadcast it to others
  socket.on('stop typing', function () {
    socket.broadcast.emit('stop typing', {
      username: socket.username
    });
  });

  // when the user disconnects.. perform this
  socket.on('disconnect', function () {
    if (addedUser) {
      --numUsers;

      // echo globally that this client has left
      socket.broadcast.emit('user left', {
        username: socket.username,
        numUsers: numUsers
      });
    }
  });

  socket.on('roll dice', function(dice){

    var diceResult = getRandomInt(1, dice);
    socket.broadcast.emit('new message', {
      username: socket.username,
      message: diceResult
    });
  });
});

http.listen(port, function(){
  console.log('listening on *:3000');
});