import { JOIN_CHAT, ADD_STREAM, MY_STREAM, ADD_REMOTE_STREAM, REMOVE_STREAM, ADD_USERS, SEND_MESSAGE, CONNECTION_LOST, RESET } from './types';
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
// let call = null;

export const sendMessage = (roomId, message) => async(dispatch) => {
  console.log('This is initial PeerServer Object', peerServer);
  socket.emit('send-message', {roomId, message});
  dispatch({type:SEND_MESSAGE,payload:message});
  console.log('message recieved=========>', message)
}

export const makeSocketAlive = () => async(dispatch) => {
  socket.emit('online');
}

export const joinRoom = (stream, meetingId, user) => async(dispatch) => {
  peerServer = peer()
  const roomId = meetingId;
  const remoteUser = user;
  const remoteSocketId = socket.id
  let remotePeerID;
  dispatch({type:MY_STREAM, payload:{stream:stream,id:remoteSocketId,user:user}});

  socket.on('recieve-message', ({message}) => {
    dispatch({type:SEND_MESSAGE, payload:message});
  })

  //connection to server
  peerServer.on('open',(peerID)=>{
    remotePeerID = peerID;
    socket.emit('join-room', {peerID, roomId, user})
  })

  peerServer.on('disconnected', () => {
    console.log('peerServer Disconnected')
    socket.emit('join-room', {remotePeerID, roomId, user})
    // dispatch({type:CONNECTION_LOST, payload:true})
    // return true
  })

  peerServer.on('error', (err) => {
    console.log('this is peerServer error', err);
  })

  socket.on('new-user',({users})=>{
    console.log('new user event')
    dispatch({type:ADD_USERS,payload:users})
  })

  socket.on('user-connected', ({peerID,roomId,socketId, user})=>{
    console.log('this is sample server User====>', user, remoteUser);
    const call = peerServer.call(peerID, stream,{metadata:{user:remoteUser,socketId:remoteSocketId}});
    console.log('first call event',call);
    call.on('stream', (remoteVideoStream) => {
      console.log('stream call event',call);
      if(remoteVideoStream){
        dispatch({type:ADD_REMOTE_STREAM, payload:{stream:remoteVideoStream,id:socketId,user:user}})
      }
    })
  })

  //recieve a call
  peerServer.on('call',(call, options)=>{
    console.log('calling',call);
    call.answer(stream);

    //stream back the call
    call.on('stream', (stream)=>{
      console.log('This is the Add Streams ====>', stream)
      dispatch({type:ADD_STREAM, payload:{stream:stream,id:call.metadata.socketId,user:call.metadata.user}})
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
    console.log('disconencted event triggered', )
    dispatch({type:REMOVE_STREAM, payload:{id:socketId}});
  })

  socket.on('connection-lost',({socketId}) => {
    console.log('connection lost by me', socketId);
  })
}

export const muteAudio = (stream,user) => async(dispatch) => {
  dispatch({type:MY_STREAM, payload:{stream:stream,id:socket.id,user:user}});
}

export const muteVideo = (stream,user) => async(dispatch) => {
  dispatch({type:MY_STREAM, payload:stream});
}

export const endMeeting = (roomId,stream,user,socketId) => async(dispatch) => {
  console.log('meeting has ended');
  socket.emit('leave-room',{roomId,socketId,user});
  console.log('destroy peerServer', peerServer);
  peerServer.destroy()
  // call.close();
  dispatch({type:RESET, payload:null})
}