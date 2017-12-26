declare namespace /* Interfaces */ I {
  export interface Action {
    type: string;
    error?: boolean;
    payload?: Error | { [key: string]: any } | null;
    meta?: { [key: string]: any } | null;
  }

  export interface ActionError<T extends string , Error, M> extends Action {
    type: T;
    error: true;
    payload: Error;
    meta: M;
  }

  export interface ActionSuccess<T extends string, P, M> extends Action {
    type: T;
    error: false;
    payload: P;
    meta: M;
  }

  interface IReducer<D, S, C> {
    domain: D;
    toString(): D;
    (state: S, action: Action): S;
  }

  interface Default<D, S, C> {
    (state: S): IReducer<D, S, C>;
    <A extends Action>(reducer: (state: S, action: A, config: C) => S): IReducer<D, S, C>;
  }

  interface Case<D, S, C> {
    (actionType: string): {
      case: Case<D, S, C>;
      do: Do<D, S, C>;
    };
    (action: Action): {
      case: Case<D, S, C>;
      do: Do<D, S, C>;
    };
    (actionCreator: { toString(): string }): {
      case: Case<D, S, C>;
      do: Do<D, S, C>;
    };
  }

  interface Do<D, S, C> {
    <E extends Error, M>(reducer: (state: S, action: ActionError<string, E, M>, config: C) => S): {
      default: Default<D, S, C>;
      case: Case<D, S, C>;
      do: Do<D, S, C>;
    };
    <E extends Error>(reducer: (state: S, action: ActionError<string, E, null>, config: C) => S): {
      default: Default<D, S, C>;
      case: Case<D, S, C>;
      do: Do<D, S, C>;
    };
    <P, M>(reducer: (state: S, action: ActionSuccess<string, P, M>, config: C) => S): {
      default: Default<D, S, C>;
      case: Case<D, S, C>;
      do: Do<D, S, C>;
    };
    <P>(reducer: (state: S, action: ActionSuccess<string, P, null>, config: C) => S): {
      default: Default<D, S, C>;
      case: Case<D, S, C>;
      do: Do<D, S, C>;
    };
    (reducer: (state: S, action: Action, config: C) => S): {
      default: Default<D, S, C>;
      case: Case<D, S, C>;
      do: Do<D, S, C>;
    };
  }

  interface ActionCreator<P, M, T extends string> {
    readonly type: string;
    toString(): string;

    <E extends Error, EM extends M>(payload: E, meta: EM): ActionError<T, E, EM>;
    <E extends Error>(payload: E): ActionError<T, E, null>;

    <PS extends P, MS extends M>(payload: PS, meta: MS): ActionSuccess<T, PS, MS>;
    <PS extends P>(payload: PS): ActionSuccess<T, PS, null>;
    <MS extends M>(payload: null | undefined, meta: MS): ActionSuccess<T, null, MS>;
    (): ActionSuccess<T, null, null>;
  }
}

export function createReducer<
  S extends { [key: string]: any },
  C extends { [key: string]: any } = { [key: string]: any },
  D extends string = string
>(domain: D): {
  default: I.Default<D, S, C>;
  case: I.Case<D, S, C>;

  config<CC extends C>(config: CC): {
    default: I.Default<D, S, CC>;
    case: I.Case<D, S, CC>
  }
};

export function createAction<
  P extends { [key: string]: any } = { [key: string]: any },
  M extends { [key: string]: any } = { [key: string]: any },
  T extends string = string
>(type: T): I.ActionCreator<P, M, T>;
