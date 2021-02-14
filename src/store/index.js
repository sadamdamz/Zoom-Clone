import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import reducer from './reducer';

const middlleWare = [thunk];

const initialState = {};

const store = createStore(
  reducer,
  initialState,
  applyMiddleware(...middlleWare)
);

export default store;