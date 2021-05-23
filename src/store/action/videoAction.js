import { JOIN_CHAT, ADD_STREAM, MY_STREAM, ADD_REMOTE_STREAM, REMOVE_STREAM, ADD_USERS, SEND_MESSAGE, RESET } from './types';
import IO from 'socket.io-client';
import Peer from 'react-native-peerjs'
import { Constant } from '../../constants';

export const API_URL = Constant.endPoints.API_URL 

const peer = () => {
  let peerServer =  new Peer(undefined, {
    host: "wedgrab.com",
    secure: true,
    port: 443,
    path: '/mypeer'
  })
  return peerServer
}

//socket config
export const socket = IO(`${API_URL}`,{
  forceNew: false,
})

socket.on('connection',()=>{
  console.log('client connected');
})

let peerServer = null;
let call = null;

export const sendMessage = (roomId, message) => async(dispatch) => {
  socket.emit('send-message', {roomId, message});
  dispatch({type:SEND_MESSAGE,payload:message});
  console.log('message recieved=========>', message)
}

export const joinRoom = (stream, meetingId, user) => async(dispatch) => {
  peerServer = peer()
  const roomId = meetingId;
  dispatch({type:MY_STREAM, payload:{stream:stream,id:socket.id,user:user}});

  socket.on('recieve-message', ({message}) => {
    dispatch({type:SEND_MESSAGE, payload:message});
  })

  //connection to server
  peerServer.on('open',(peerID)=>{
    socket.emit('join-room', {peerID, roomId, user})
  })

  socket.on('new-user',({users})=>{
    dispatch({type:ADD_USERS,payload:users})
  })

  socket.on('user-connected', ({peerID,roomId,socketId, user})=>{
    call = peerServer.call(peerID, stream,{metadata:{user:user}});
    console.log('first call event',call);
    call.on('stream', (remoteVideoStream) => {
      console.log('stream call event',call);
      if(remoteVideoStream){
        dispatch({type:ADD_REMOTE_STREAM, payload:{stream:remoteVideoStream,id:socketId,user:call.metadata}})
      }
    })
  })

  //recieve a call
  peerServer.on('call',(call)=>{
    console.log('calling',call)
    call.answer(stream);

    //stream back the call
    call.on('stream', (stream)=>{
      dispatch({type:ADD_STREAM, payload:{stream:stream,id:socket.id,user:call.metadata}})
    })
  })

  peerServer.on('close',(call)=>{
    console.log('closed event trigerred',call)
  })

  socket.on('user-left',({socketId})=>{
    console.log('user-left event',socketId);
    dispatch({type:REMOVE_STREAM, payload:{id:socketId}});
    })

  socket.on('disconnected',({socketId,roomId,user})=>{
    dispatch({type:REMOVE_STREAM, payload:{id:socketId}});
  })

}

export const muteAudio = (stream,user) => async(dispatch) => {
  dispatch({type:MY_STREAM, payload:{stream:stream,id:socket.id,user:user}});
}

export const muteVideo = (stream,user) => async(dispatch) => {
  dispatch({type:MY_STREAM, payload:{stream:stream,id:socket.id,user:user}});
}

export const endMeeting = (roomId,stream,user,socketId) => async(dispatch) => {

  socket.emit('leave-room',{roomId,socketId,user});
  peerServer.destroy()
  // call.close();
  dispatch({type:RESET, payload:null})

}