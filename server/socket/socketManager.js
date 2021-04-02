const firebase = require('../controllers/firebase');
const db = require('../config/firebase');

let users = {};

const socketToRoom = {};

module.exports = function (socket) {
  console.log('socket connected', socket.id);

  // Join Room Event
  socket.on('join-room', ({peerID, roomId, user}) => {
    let socketId = socket.id;
    if (users[roomId]) {
      let length = users[roomId].length;
      if (length == 40) {
        socket.emit('room-full');
        return;
      }
      users[roomId].push(user);
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
        users: users[roomId],
      });
    socket.to(roomId).emit('new-user',{users:users[roomId]});
  });

  // Leave room event
  socket.on('leave-room', async ({roomId, socketId, user}) => {
    console.log(roomId, socketId, 'leaving room');
    if (users[roomId]) {
      users[roomId] = users[roomId].filter((item, index) => {
        return item.uid !== user.uid;
      });
    } else {
      console.log('nothing need to remove');
      return;
    }
    const meetingId = roomId;
    try {
      let data = await db.ref('meetings/' + meetingId).once('value');
      let get = await data.val();
      let dbusers = get.users.filter((item, index) => {
        return item.uid !== user.uid;
      });
      if (dbusers.length == 0) {
        await db.ref('meetings/' + meetingId).remove();
        console.log(`meetingId:${meetingId} Ended Successfully`);
        socket.leave(roomId).emit('user-left', {socketId, users:[]});
        socket.to(roomId).emit('new-user',{users:[]});
        console.log('end meeting lenght', users[roomId]);
      } else {
        await db.ref('meetings/' + meetingId).set({host: true, users: dbusers});
        console.log(`user removed from the meeting ${meetingId}`);
        socket
          .leave(roomId)
          .emit('user-left', {socketId, users: users[roomId]});
        socket.to(roomId).emit('new-user',{users:users[roomId]});
        console.log('end meeting lenght', users[roomId].length);
      }
    } catch (error) {
      console.log(error);
    }
  });

  socket.on('disconnecting', () => {
    console.log(socket.rooms, 'disconnected'); // the Set contains at least the socket ID
  });

  socket.on('disconnect', () => {
    console.log('simple disconnect', socket.rooms);
    // socket.rooms.size === 0
  });
};
