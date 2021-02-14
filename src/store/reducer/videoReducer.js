import { MY_STREAM, ADD_STREAM } from "../action/types";

const initialState = {
  stream: null,
  myStream: null,
  streams: [],
};

export default (state=initialState, {type, payload}) => {
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
    default:
     return state;
  }
}