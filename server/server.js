const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const socketio = require('socket.io');
const morgan = require('morgan');

const { ExpressPeerServer } = require('peer')

const app = express();

const server = http.createServer(app);

const io = socketio(server).sockets;

app.use(express.json());

app.use(bodyParser.json({ type: 'application/*+json' }));

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

app.use('/api/v1', require('./routes/firebase'))

io.on('connection', function(socket){
  console.log('socket connected')
  socket.on('join-room', ({roomId,peerID})=>{
    console.log('newuser',roomId,peerID);
    socket.join(roomId);
    socket.to(roomId).broadcast.emit('user-connected', peerID)
  })
})

io.on('disconnect', function(socket){
  console.log('User with socketId %s disconnected', socket.id);
});

const port = process.env.PORT || 5000;

server.listen(port, ()=>console.log(`server is running on port ${port}`));