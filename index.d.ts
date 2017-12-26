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

  export interface Default<S, C> {
    (state: S): (state: S, action: Action) => S;
    <A extends Action>(reducer: (state: S, action: A, config: C) => S): (state: S, action: Action) => S;
  }

  export interface Case<S, C> {
    (actionType: string): {
      case: Case<S, C>;
      do: Do<S, C>;
    };
    (action: Action): {
      case: Case<S, C>;
      do: Do<S, C>;
    };
    (actionCreator: { toString(): string }): {
      case: Case<S, C>;
      do: Do<S, C>;
    };
  }

  export interface Do<S, C> {
    <E extends Error, M>(reducer: (state: S, action: ActionError<string, E, M>, config: C) => S): {
      default: Default<S, C>;
      case: Case<S, C>;
      do: Do<S, C>;
    };
    <E extends Error>(reducer: (state: S, action: ActionError<string, E, null>, config: C) => S): {
      default: Default<S, C>;
      case: Case<S, C>;
      do: Do<S, C>;
    };
    <P, M>(reducer: (state: S, action: ActionSuccess<string, P, M>, config: C) => S): {
      default: Default<S, C>;
      case: Case<S, C>;
      do: Do<S, C>;
    };
    <P>(reducer: (state: S, action: ActionSuccess<string, P, null>, config: C) => S): {
      default: Default<S, C>;
      case: Case<S, C>;
      do: Do<S, C>;
    };
    (reducer: (state: S, action: Action, config: C) => S): {
      default: Default<S, C>;
      case: Case<S, C>;
      do: Do<S, C>;
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
  C extends { [key: string]: any } = { [key: string]: any }
>(domain: string): {
  default: I.Default<S, C>;
  case: I.Case<S, C>;

  config(config: C): {
    default: I.Default<S, C>;
    case: I.Case<S, C>
  }
};

export function createAction<
  P extends { [key: string]: any } = { [key: string]: any },
  M extends { [key: string]: any } = { [key: string]: any },
  T extends string = string
>(type: T): I.ActionCreator<P, M, T>;
