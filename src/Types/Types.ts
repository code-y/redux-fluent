export type ACTION_TYPE = string;

export interface PlainObject {
  [key: string]: {};
}

export interface GenericState extends PlainObject {}

export interface GenericConfig extends PlainObject {}

export interface GenericMeta extends PlainObject {}

export interface GenericPayload extends PlainObject {}

export interface GenericAction<P = GenericPayload, M = GenericMeta> {
  readonly type: ACTION_TYPE;
  error?: boolean;
  payload?: P;
  meta?: M;
}

export interface ActionCreator<P = GenericPayload, M = GenericMeta> {
  readonly type: ACTION_TYPE;
  toString(): ACTION_TYPE;
  (payload?: P, meta?: M): GenericAction<P, M>;
}

export interface GenericReducer<S = GenericState, A = GenericAction> {
  (state: S, action: A): S;
}

export interface ReduxFluentReducer<S = GenericState, A = GenericAction, C = GenericConfig> {
  (state: S, action: A, config: C): S;
}

