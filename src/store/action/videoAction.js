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
  const roomId = 'lsdfjlsdjfljalsdlflj';
  dispatch({type:MY_STREAM, payload:stream});

  //connection to server
  peerServer.on('open',(userId)=>{
    socket.emit('join-room', {userId, roomId})
  })

  socket.on('user-connected', (userId)=>{
    connectToNewUser(userId, stream, dispatch)
  })

  //recieve a call
  peerServer.on('call',(call)=>{
    call.answer(stream);

    //stream back the call
    call.on('stream', (stream)=>{
      dispatch({type:ADD_STREAM, payload:stream})
    })

  })
}

function connectToNewUser(userId, stream, dispatch) {
  const call = peerServer.call(userId, stream);
}