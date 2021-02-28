import { MY_STREAM, ADD_STREAM, ADD_REMOTE_STREAM, REMOVE_STREAM } from "../action/types";

const initialState = {
  myStream: null,
  streams: [],
  remoteStreams: []
};

export default (state=initialState, {type, payload}) => {
  console.log(initialState);
  switch (type) {
    case MY_STREAM: 
      return {
        ...state,
        myStream: payload
      }
    case ADD_STREAM:
      return {
        ...state,
        streams: [...state.streams, payload]
      }
    case ADD_REMOTE_STREAM: 
      return {
        ...state,
        remoteStreams: [...state.remoteStreams,payload]
      }
    case REMOVE_STREAM:
      console.log(payload.stream.id)
      let streams = state.streams.filter((item,index)=>{
        return item.stream.id !== payload.stream.id
      })
      let remoteStreams = state.remoteStreams.filter((item,index)=>{
        return item.stream.id !== payload.stream.id
      })
      return {
        ...state,
        myStream: null,
        streams: [],
        remoteStreams: [],
      }
    default:
     return state;
  }
}