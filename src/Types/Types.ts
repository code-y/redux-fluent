export type ACTION_TYPE = string;

export interface PlainObject {
  [key: string]: {};
}

export interface State extends PlainObject {}
export interface Meta extends PlainObject {}
export interface Payload extends PlainObject {}

export interface Action<P = Payload, M = Meta> {
  readonly type: ACTION_TYPE;
  readonly error: boolean;
  readonly payload: P | Error | null;
  readonly meta: M | null;
}

export interface ActionCreator<P = Payload, M = Meta> {
  readonly type: ACTION_TYPE;
  toString(): ACTION_TYPE;
  (payload?: P | Error, meta?: M): Action<P | Error, M>;
}

export interface Reducer<S = State, A = Action> {
  (state: S, action: A): S;
}

export interface ReduxFluentReducer<S = State, A = Action, C = PlainObject> {
  (state: S, action: A, config: C): S;
}

