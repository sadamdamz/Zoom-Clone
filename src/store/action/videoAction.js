import { JOIN_CHAT, ADD_STREAM, MY_STREAM, ADD_REMOTE_STREAM, REMOVE_STREAM } from './types';
import IO from 'socket.io-client';
import Peer from 'react-native-peerjs'

export const API_URL = `http://192.168.43.20:5000`; //local ip

// export const API_URL = 'http://192.168.0.103:5000'; office ip


// export const API_URL = `http://139.59.34.203:5000`; //live ip

const peer = () => {
  let peerServer =  new Peer(undefined, {
    host: '139.59.34.203',
    secure: false,
    port: 5000,
    path: '/mypeer'
  })
  return peerServer
}

//socket config
export const socket = IO(`${API_URL}`,{
  forceNew: true,
})

socket.on('connection',()=>{
  console.log('client connected');
})

export const joinRoom = (stream, meetingId, user) => async(dispatch) => {
  const peerServer = peer();
  console.log(peerServer);
  
  const roomId = meetingId;

  dispatch({type:MY_STREAM, payload:{stream:stream,id:socket.id,user:user}});

  //connection to server
  peerServer.on('open',(peerID)=>{
    console.log('first peer id = ', peerID)
    socket.emit('join-room', {peerID, roomId})
  })

  socket.on('user-connected', ({peerID,roomId,socketId})=>{
    const call = peerServer.call(peerID, stream);
    call.on('stream', (remoteVideoStream) => {
      if(remoteVideoStream){
        dispatch({type:ADD_REMOTE_STREAM, payload:{stream:remoteVideoStream,id:socketId,user:user}})
      }
    })
  })

  //recieve a call
  peerServer.on('call',(call)=>{
    console.log(call);
    call.answer(stream);

    //stream back the call
    call.on('stream', (stream)=>{
      dispatch({type:ADD_STREAM, payload:{stream:stream,id:socket.id,user:user}})
    })
  })
}

export const muteAudio = (stream,user) => async(dispatch) => {
  dispatch({type:MY_STREAM, payload:{stream:stream,id:socket.id,user:user}});
}

export const muteVideo = (stream,user) => async(dispatch) => {
  dispatch({type:MY_STREAM, payload:{stream:stream,id:socket.id,user:user}});
}

export const endMeeting = (roomId,stream,user) => async(dispatch) => {
  
  const peerServer = peer();
  console.log(peerServer);
  let socketId = socket.id

  peerServer.on('open',(peerID)=>{
    console.log('second peerID =', peerID)
    socket.emit('leave-room',{roomId,socketId,user,peerID});
  })

  socket.on('user-left',({socketId,peerID})=>{
    dispatch({type:REMOVE_STREAM, payload:{stream:stream,id:socketId,user:user}});
    console.log(`user left from ${roomId} and socket id is ${socketId} and peerId is ${peerID} and close object is ${stream}`);
    })

}