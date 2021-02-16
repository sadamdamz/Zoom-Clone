const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const morgan = require('morgan');

const { ExpressPeerServer } = require('peer')

const app = express();

const server = http.createServer(app);

const io = socketio(server).sockets;

app.use(express.json());

const customGenrationFunction = () => {
  return(
    Math.random().toString(36) + "0000000000000"
  ).substr(2,16);
}

const peerServer = ExpressPeerServer(server, {
  debug: true,
  path: '/',
  generateClientId: customGenrationFunction,
});

app.use('/mypeer', peerServer);

io.on('connection', function(socket){
  console.log('socket connected')
  socket.on('join-room', ({roomId,userID})=>{
    console.log('newuser',roomId,userID);
    socket.join(roomId);
    socket.to(roomId).broadcast.emit('user-connected', userID);
  })
})

const port = process.env.PORT || 5000;

server.listen(port, ()=>console.log(`server is running on port ${port}`));