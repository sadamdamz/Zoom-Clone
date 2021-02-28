const db = require('../config/firebase');

const users = {};

const socketToRoom = {};

module.exports = function(socket){
  console.log('socket connected', socket.id)
  socket.on('join-room', ({peerID,roomId})=>{
    console.log('newuser',roomId,peerID);
    if(users[roomId]){
      let length = users[roomId].length;
      if(length==40){
        socket.emit("room-full")
        return
      }
      users[roomId].push(socket.id);
    }else{
      users[roomId] = [socket.id];
    }
    socket.join(roomId);
    socket.to(roomId).broadcast.emit('user-connected', peerID)
    console.log(users);
  })

  socket.on('leave-room', ({roomId, socketId})=>{
    console.log(roomId, socketId,'leaving room');
    socket.leave(roomId).broadcast.emit('user-left', socketId);
  })

  socket.on('disconnecting', () => {
    console.log(socket.rooms, 'disconnected'); // the Set contains at least the socket ID
  });

  socket.on('disconnect', () => {
    console.log('simple disconnect', socket.rooms)
    // socket.rooms.size === 0
  });
}