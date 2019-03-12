/* eslint-disable max-len */
import { combineReducers } from 'redux';
// eslint-disable-next-line no-unused-vars
import { RFR } from '../create-reducer/createReducer';


// https://stackoverflow.com/questions/55086835/typescript-typings-array-of-t-to-map/55086869?noredirect=1#comment96919894_55086869
type O<V> = V extends { type: infer K } ? (K extends string ? K : never) : never;
type T<A> = { [K in O<A>]: A }

interface CreateReducersMapObject {
  <A extends RFR>(arg: A): T<A>
  <A extends RFR, B extends RFR>(arg: A, arg2: B): T<A> & T<B>;
  <A extends RFR, B extends RFR, C extends RFR>(arg: A, arg2: B, arg3: C): T<A> & T<B> & T<C>;
  <A extends RFR, B extends RFR, C extends RFR, D extends RFR>(arg: A, arg2: B, arg3: C, arg4: D): T<A> & T<B> & T<C> & T<D>;
  <A extends RFR, B extends RFR, C extends RFR, D extends RFR, E extends RFR>(arg: A, arg2: B, arg3: C, arg4: D, arg5: E): T<A> & T<B> & T<C> & T<D> & T<E>;
  <A extends RFR>(...args: RFR[]): { [type: string]: RFR };
}

export const createReducersMapObject: CreateReducersMapObject = (...reducers: RFR[]) => reducers.reduce(
  (res, reducer) => Object.assign({}, res, { [reducer.type]: reducer }),
  {},
);

export const combineReduxFluentReducers = (...reducers: RFR[]) => (
  combineReducers(createReducersMapObject(...reducers))
);
