import { createStore, applyMiddleware } from 'redux';
import { thunk } from 'redux-thunk';

const middlleWare = [thunk];

import reducer from './reducer';

const initialState = {};

const store = createStore(
  reducer,
  initialState,
  applyMiddleware(...middlleWare)
);

export default store;