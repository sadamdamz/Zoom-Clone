import { JOIN_CHAT, ADD_STREAM, MY_STREAM, ADD_REMOTE_STREAM } from './types';
import IO from 'socket.io-client';
import Peer from 'react-native-peerjs'

export const API_URL = `http://192.168.43.20:5000`;

//socket config
export const socket = IO(`${API_URL}`,{
  forceNew: true,
})

socket.on('connection',()=>{
  console.log('client connected');
})

//peer config
const peerServer = new Peer(undefined, {
  host: '192.168.43.20',
  secure: false,
  port: 5000,
  path: '/mypeer'
})

export const joinRoom = (stream) => async(dispatch) => {
  // console.log(stream);
  const roomId = '123456';
  
  dispatch({type:MY_STREAM, payload:stream});

  //connection to server
  peerServer.on('open',(userID)=>{
    console.log(userID);
    socket.emit('join-room', {userID, roomId})
  })

  socket.on('user-connected', (userID)=>{
    connectToNewUser(userID, stream, dispatch)
  })

  //recieve a call
  peerServer.on('call',(call)=>{
    call.answer(stream);

    //stream back the call
    call.on('stream', (stream)=>{
      console.log(stream);
      dispatch({type:ADD_STREAM, payload:stream})
    })
  })
}

function connectToNewUser(userID, stream, dispatch) {
  const call = peerServer.call(userID, stream);
  call.on('stream', (remoteVideoStream) => {
    if(remoteVideoStream){
      dispatch({type:ADD_REMOTE_STREAM, payload:remoteVideoStream})
    }
  })
}