import { MY_STREAM, ADD_STREAM, ADD_REMOTE_STREAM, REMOVE_STREAM, ADD_USERS, RESET } from "../action/types";

const initialState = {
  myStream: null,
  streams: [],
  remoteStreams: [],
  users:[],
};

export default (state=initialState, {type, payload}) => {
  console.log(type,state, payload)
  switch (type) {
    case MY_STREAM: 
      return {
        ...state,
        myStream: payload
      }
    case ADD_STREAM:
      let stream = state.streams.filter((item,index)=>{
        return item.id !== payload.id
      })
      return {
        ...state,
        streams: [...stream,payload]
      }
    case ADD_REMOTE_STREAM: 
    let remote = state.remoteStreams.filter((item,index)=>{
      return item.id !== payload.id
    })
      return {
        ...state,
        remoteStreams: [...remote,payload]
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
      return {
        ...state,
        streams: streams,
        remoteStreams: remoteStreams,
      }
    case RESET:
      return{
        myStream: null,
        streams: [],
        remoteStreams: [],
        users:[],
      }
    default:
     return state;
  }
}