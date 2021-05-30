import { MY_STREAM, ADD_STREAM, ADD_REMOTE_STREAM, REMOVE_STREAM, ADD_USERS, SEND_MESSAGE, CONNECTION_LOST, RESET } from "../action/types";

const initialState = {
  myStream: null,
  streams: [],
  remoteStreams: [],
  users:[],
  allStreams:[],
  messages:[],
  connectionLost: false,
};

export default (state=initialState, {type, payload}) => {
  console.log('Redux Log=================>',type,state, payload)
  switch (type) {
    case MY_STREAM: 
      return {
        ...state,
        myStream: payload,
      }
    case ADD_STREAM:
      let stream = state.streams.filter((item,index)=>{
        return item.id !== payload.id
      })
      let dataStreams = state.allStreams.filter((item,index)=>{
        return item.id !== payload.id
      })
      return {
        ...state,
        streams: [...stream,payload],
        allStreams: [...dataStreams,payload]
      }
    case ADD_REMOTE_STREAM: 
    let remote = state.remoteStreams.filter((item,index)=>{
      return item.id !== payload.id
    })
    let dataStreamRemote = state.allStreams.filter((item,index)=>{
      return item.id !== payload.id
    })
    console.log('remotepayload========>', remote, payload);
      return {
        ...state,
        remoteStreams: [...remote,payload],
        allStreams: [...dataStreamRemote,payload]
      }
    case ADD_USERS:
      return{
        ...state,
        users: [payload]
      }
    case REMOVE_STREAM:
      let streams = state.streams.filter((item,index)=>{
        return item.id !== payload.id
      })
      let remoteStreams = state.remoteStreams.filter((item,index)=>{
        return item.id !== payload.id
      })
      let removeStreams = state.allStreams.filter((item,index)=>{
        return item.id !== payload.id
      })
      return {
        ...state,
        streams: streams,
        remoteStreams: remoteStreams,
        allStreams: removeStreams
      }
    case SEND_MESSAGE:
    let result = state.messages.filter((item,index)=>{
      return item?._id !== payload[0]?._id
    })
      return {
        ...state,
        messages: [...payload, ...result]
      }
    case CONNECTION_LOST:
      return {
        ...state,
        connectionLost: payload
      }
    case RESET:
      return {
        myStream: null,
        streams: [],
        remoteStreams: [],
        users:[],
        allStreams:[],
        messages:[],
        connectionLost: false,
      }
    default:
     return state;
  }
}