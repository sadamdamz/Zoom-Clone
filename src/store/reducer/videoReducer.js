import { MY_STREAM, ADD_STREAM, ADD_REMOTE_STREAM, REMOVE_STREAM, ADD_USERS, SEND_MESSAGE, RESET } from "../action/types";

const initialState = {
  myStream: null,
  streams: [],
  remoteStreams: [],
  users:[],
  allStreams:[],
  messages:[],
};

export default (state=initialState, {type, payload}) => {
  console.log(type,state, payload)
  switch (type) {
    case MY_STREAM: 
    let dataStream = state.allStreams;
    if(state.allStreams.length===0){
      dataStream = [payload]
    }
      return {
        ...state,
        myStream: payload,
        allStreams: dataStream,
      }
    case ADD_STREAM:
      let stream = state.streams.filter((item,index)=>{
        return item.id !== payload.id
      })
      return {
        ...state,
        streams: [...stream,payload],
        allStreams: [...state.allStreams,payload]
      }
    case ADD_REMOTE_STREAM: 
    let remote = state.remoteStreams.filter((item,index)=>{
      return item.id !== payload.id
    })
      return {
        ...state,
        remoteStreams: [...remote,payload],
        allStreams: [...state.allStreams,payload]
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
        allStreams: [state.myStream,...streams,...remoteStreams]
      }
    case SEND_MESSAGE:
      console.log('payload========>',payload, state.messages);
      var dataArr = state.messages?.map(item=>{
        return [item._id,item]
        }); // creates array of array
    var maparr = new Map(dataArr); // create key value pair from array of array
    
    var result = [...maparr.values()];//converting back to array from mapobject
    console.log('dataArray======>', dataArr, maparr, result);
      return {
        ...state,
        messages: [...payload, ...result]
      }

    case RESET:
      return{
        myStream: null,
        streams: [],
        remoteStreams: [],
        users:[],
        allStreams: [],
        messages:[],
      }
    default:
     return state;
  }
}