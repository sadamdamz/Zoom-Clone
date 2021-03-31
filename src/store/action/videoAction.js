import { JOIN_CHAT, ADD_STREAM, MY_STREAM, ADD_REMOTE_STREAM, REMOVE_STREAM } from './types';
import IO from 'socket.io-client';
import Peer from 'react-native-peerjs'
import { Constant } from '../../constants';

export const API_URL = Constant.endPoints.API_URL 

const peer = () => {
  let peerServer =  new Peer(undefined, {
    host: Constant.endPoints.API_ENDPOINT,
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

let peerServer = null;

export const joinRoom = (stream, meetingId, user) => async(dispatch) => {
  peerServer = peer()
  const roomId = meetingId;
  console.log('myself', user);
  dispatch({type:MY_STREAM, payload:{stream:stream,id:socket.id,user:user}});

  //connection to server
  peerServer.on('open',(peerID)=>{
    socket.emit('join-room', {peerID, roomId, user})
  })

  socket.on('user-connected', ({peerID,roomId,socketId, user})=>{
    console.log('socket users',user);
    const call = peerServer.call(peerID, stream);
    call.on('stream', (remoteVideoStream) => {
      if(remoteVideoStream){
        dispatch({type:ADD_REMOTE_STREAM, payload:{stream:remoteVideoStream,id:socketId,user:user}})
      }
    })
  })

  //recieve a call
  peerServer.on('call',(call)=>{
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
  
  let socketId = socket.id

  socket.emit('leave-room',{roomId,socketId,user,peerID});
  
  // peerServer.on('close',(closed)=>{
  //   console.log('this is close event',closed)
  // })

  socket.on('user-left',({socketId,peerID})=>{
    let call = peerServer.destroy()
    dispatch({type:REMOVE_STREAM, payload:{stream:stream,id:socketId,user:user}});
    console.log(`user left from ${roomId} and socket id is ${socketId} and peerId is ${peerID} and close object is ${stream}`);
    })

}