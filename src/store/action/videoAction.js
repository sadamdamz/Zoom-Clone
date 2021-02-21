import { JOIN_CHAT, ADD_STREAM, MY_STREAM, ADD_REMOTE_STREAM } from './types';
import IO from 'socket.io-client';
import Peer from 'react-native-peerjs'

export const API_URL = `http://192.168.43.20:5000`;

const peer = () => {
  return new Peer(undefined, {
    host: '192.168.43.20',
    secure: false,
    port: 5000,
    path: '/mypeer'
  })
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
  
  const roomId = meetingId;

  dispatch({type:MY_STREAM, payload:stream});

  //connection to server
  peerServer.on('open',(peerID)=>{
    socket.emit('join-room', {peerID, roomId})
  })

  socket.on('user-connected', (peerID)=>{
    const call = peerServer.call(peerID, stream);
    console.log(call)
    call.on('stream', (remoteVideoStream) => {
      console.log('remotestream', remoteVideoStream)
      if(remoteVideoStream){
        dispatch({type:ADD_REMOTE_STREAM, payload:remoteVideoStream})
      }
    })
    // connectToNewUser(peerID, stream, dispatch)
  })
  
  //recieve a call
  peerServer.on('call',(call)=>{
    console.log('answer',call, stream)
    call.answer(stream);

    //stream back the call
    call.on('stream', (stream)=>{
      dispatch({type:ADD_STREAM, payload:stream})
    })
  })
}