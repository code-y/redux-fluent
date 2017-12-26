declare module 'redux-fluent' {
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
}

declare namespace /* Interfaces */ I {
  export interface Action {
    type: string;
    error: boolean;
    payload: { [key: string]: any } | null;
    meta: { [key: string]: any } | null;
  }

  export interface ActionError<
    T extends string,
    E extends Error,
    M
  > extends Action {
    type: T;
    error: true;
    payload: E;
    meta: M;
  }

  export interface ActionSuccess<
    T extends string,
    P extends { [key: string]: any } | null,
    M
  > extends Action {
    type: T;
    error: false;
    payload: P;
    meta: M;
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
    (anyToString: { toString(): string }): {
      case: Case<D, S, C>;
      do: Do<D, S, C>;
    };
  }

  interface Default<D, S, C> {
    (state: S): {
      domain: D;
      toString(): D;

      <A extends Action>(state: S, action: A): S;
    };
    <A extends Action>(arg: (state: S, action: A, config: C) => S): {
      domain: D;
      toString(): D;

      <A extends Action>(state: S, action: A): S;
    };
  }

  interface Do<D, S, C> {
    <A extends Action>(reducer: (state: S, action: A, config: C) => S): {
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
