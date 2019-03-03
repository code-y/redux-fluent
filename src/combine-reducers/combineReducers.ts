import { combineReducers } from 'redux';
// eslint-disable-next-line no-unused-vars
import { CreateReducer } from '../create-reducer/createReducer';


export const createCombinableReducers = (...reducers: CreateReducer[]) => reducers.reduce(
  (res, reducer) => ({ ...res, [reducer.type]: reducer }),
  {},
);

export const combineReduxFluentReducers = (...reducers: CreateReducer[]) => (
  combineReducers(createCombinableReducers(...reducers))
);
