declare module Types {
  export interface Action {
    type: string;
    error?: boolean;
    payload?: Error | { [key: string]: any } | null;
    meta?: { [key: string]: any } | null;
  }

  export interface ActionError<E extends Error, M> extends Action {
    type: string;
    error: true;
    payload: E;
    meta: M;
  }

  export interface ActionSuccess<P extends { [key: string] : any } | null, M> extends Action {
    type: string;
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
    <E extends Error, M>(reducer: (state: S, action: ActionError<E, M>, config: C) => S): {
      default: Default<S, C>;
      case: Case<S, C>;
      do: Do<S, C>;
    };
    <E extends Error>(reducer: (state: S, action: ActionError<E, null>, config: C) => S): {
      default: Default<S, C>;
      case: Case<S, C>;
      do: Do<S, C>;
    };
    <P, M>(reducer: (state: S, action: ActionSuccess<P, M>, config: C) => S): {
      default: Default<S, C>;
      case: Case<S, C>;
      do: Do<S, C>;
    };
    <P>(reducer: (state: S, action: ActionSuccess<P, null>, config: C) => S): {
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

  interface ActionCreator<P, M> {
    readonly type: string;
    toString(): string;

    <EM extends M>(payload: Error, meta: EM): ActionError<Error, EM>;
    (payload: Error): ActionError<Error, null>;

    <PS extends P, MS extends M>(payload: PS, meta: MS): ActionSuccess<PS, MS>;
    <PS extends P>(payload: PS): ActionSuccess<PS, null>;
    <MS extends M>(payload: null | undefined, meta: MS): ActionSuccess<null, MS>;
    (): ActionSuccess<null, null>;
  }
}

export function createReducer<
  S extends { [key: string]: any },
  C extends { [key: string]: any } = { [key: string]: any }
>(domain: string): {
  default: Types.Default<S, C>;
  case: Types.Case<S, C>;

  config(config: C): {
    default: Types.Default<S, C>;
    case: Types.Case<S, C>
  }
};

export function createAction<
  P extends { [key: string]: any } = { [key: string]: any },
  M extends { [key: string]: any } = { [key: string]: any }
>(type: string): Types.ActionCreator<P, M>;
