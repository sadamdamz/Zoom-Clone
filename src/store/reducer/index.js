import { combineReducer } from "redux";
import videoReducer from "./videoReducer";

export default combineReducer({
  video: videoReducer,
})