const firebase = require('../controllers/firebase');
const db = require('../config/firebase');

const users = {};

const socketToRoom = {};

module.exports = function(socket){
  console.log('socket connected', socket.id)
  socket.on('join-room', ({peerID,roomId,user})=>{
    console.log('newuser',roomId,peerID,user);
    let socketId = socket.id
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
    socket.to(roomId).broadcast.emit('user-connected', ({peerID, roomId, socketId, user}))
    console.log(users);
  })

  socket.on('leave-room', async({roomId, socketId,user,peerID})=>{
    console.log(roomId, socketId,'leaving room');
    if(users[roomId]){
      users[roomId] = users[roomId].filter((item,index)=>{
        return item !== socketId;
      })
    }else{
      console.log('nothing need to remove')
      return;
    }
    console.log(users);
    socket.leave(roomId).emit('user-left', ({socketId,peerID}));
    const meetingId = roomId;
    try {
      let data = await db.ref('meetings/' + meetingId).once('value');
      let get = await data.val();
      let users = get.users.filter((item, index) => {
        return item.uid !== user.uid;
      });
      if (users.length == 0) {
        await db.ref('meetings/' + meetingId).remove();
        console.log(`meetingId:${meetingId} Ended Successfully`)
      } else {
        await db.ref('meetings/' + meetingId).set({host: true, users: users});
        console.log(`user removed from the meeting ${meetingId}`)
      }
    } catch (error) {
      console.log(error);
    }
  })

  socket.on('disconnecting', () => {
    console.log(socket.rooms, 'disconnected'); // the Set contains at least the socket ID
  });

  socket.on('disconnect', () => {
    console.log('simple disconnect', socket.rooms)
    // socket.rooms.size === 0
  });
}