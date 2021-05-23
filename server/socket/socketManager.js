const firebase = require('../controllers/firebase');
const db = require('../config/firebase');

let users = {};

const socketToRoom = {};

module.exports = function (socket) {
  // Join Room Event
  socket.on('join-room', ({peerID, roomId, user}) => {
    let socketId = socket.id;
    user['socketId'] = socketId;
    if (users[roomId] && users[roomId].length>0) {
      let length = users[roomId].length;
      // users[roomId].map((item,index)=>{
      //   if(item.uid!==user.uid){
          users[roomId].push(user);
      //   }
      // })
    } else {
      users[roomId] = [user];
    }
    socket.emit('new-user',{users:users[roomId]});
    socket.to(roomId).emit('new-user',{users:users[roomId]});
    socket.join(roomId);
    socket
      .to(roomId)
      .broadcast.emit('user-connected', {
        peerID,
        roomId,
        socketId,
        user:user,
      });
    socket.to(roomId).emit('new-user',{users:users[roomId]});
  });



  // Leave room event
  socket.on('leave-room', async ({roomId, socketId, user}) => {
    if (users[roomId]) {
      users[roomId] = users[roomId].filter((item, index) => {
        return item.uid !== user.uid;
      });
    } else {
      return;
    }
    const meetingId = roomId;
    socket.to(roomId).emit('new-user',{users:users[roomId]});
    socket.to(meetingId).emit('user-left',{socketId});
    socket.leave(meetingId);
    try {
      let data = await db.ref('meetings/' + meetingId).once('value');
      let get = await data.val();
      let dbusers = get.users.filter((item, index) => {
        return item.uid !== user.uid;
      });
      if (dbusers.length == 0) {
        await db.ref('meetings/' + meetingId).remove();
      } else {
        await db.ref('meetings/' + meetingId).set({host: true, users: dbusers});
      }
    } catch (error) {
      console.log(error);
    }
  });

  socket.on('send-message', ({roomId, message}) => {
    console.log('socket message====>', roomId, message);
    socket.to(roomId).broadcast.emit('recieve-message',{message});
  })


//socket disconnecting event
  socket.on('disconnecting', () => {
    let socketId = socket.id
    if(socket.rooms){
      let user = null;
      let roomId = socket.rooms[Object.keys(socket.rooms)[0]];
      if (users[roomId]) {
        user = users[roomId].filter((item,index)=>{
          return item.socketId === socketId
        })
        users[roomId] = users[roomId].filter((item, index) => {
          return item.socketId !== socketId;
        });
      } else {
        return;
      }
      socket.to(roomId).emit('new-user',{users:users[roomId]});
      socket.to(roomId).emit('disconnected',{socketId,roomId,user:user[0]});
    }
  });

  socket.on('disconnect', () => {
    // socket.rooms.size === 0
  });
};
