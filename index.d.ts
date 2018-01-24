declare module 'redux-fluent' {
  export function createReducer<
    S extends object = {},
    C extends object = object,
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
    P extends object = object,
    M extends object = object,
    T extends string = string
    >(type: T, payloadCreator?: (p: any) => P, metaCreator?: (m: any) => M): I.ActionCreator<P, M, T>;
}

declare namespace /* Interfaces */ I {
  export interface Action {
    type: string;
    error: boolean;
    payload: object | null;
    meta: object | null;
  }

  export interface ActionError<
    T extends string,
    E extends Error,
    M extends object | null
  > extends Action {
    type: T;
    error: true;
    payload: E;
    meta: M;
  }

  export interface ActionSuccess<
    T extends string,
    P extends object | null,
    M extends object | null
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
      then: Then<D, S, C>;
      catch: Catch<D, S, C>;
    };
    (action: Action): {
      case: Case<D, S, C>;
      do: Do<D, S, C>;
      then: Then<D, S, C>;
      catch: Catch<D, S, C>;
    };
    (anyToString: { toString(): string }): {
      case: Case<D, S, C>;
      do: Do<D, S, C>;
      then: Then<D, S, C>;
      catch: Catch<D, S, C>;
    };
  }

  interface Do<D, S, C> {
    <A extends Action>(reducer: (state: S, action: A, config: C) => S): {
      default: Default<D, S, C>;
      case: Case<D, S, C>;
      do: Do<D, S, C>;
      then: Then<D, S, C>;
      catch: Catch<D, S, C>;
    };
  }

  interface Default<D, S, C> {
    (state?: S): {
      readonly domain: D;
      toString(): D;

      <A extends Action>(state: S, action: A): S;
    };
    <A extends Action>(arg: (state: S, action: A, config: C) => S): {
      domain: D;
      toString(): D;

      <A extends Action>(state: S, action: A): S;
    };
  }

  interface Then<D, S, C> {
    <A extends ActionSuccess, AE extends ActionError>(
      success: (s: S, a: A, c: C) => S, error?: (s: S, a: AE, c: C) => S
    ): Do<D, S, C>
  }

  interface Catch<D, S, C> {
    <AE extends ActionError>(error: (s: S, a: AE, c: C) => S): Do<D, S, C>
  }

  interface ActionCreator<
    P extends object = object,
    M extends object = object,
    T extends string = string
  > {
    readonly type: string;
    toString(): string;

    <E extends Error, EM extends M>(payload: E, meta: EM): Readonly<ActionError<T, E, EM>>;
    <E extends Error>(payload: E): Readonly<ActionError<T, E, null>>;

    <PS extends P, MS extends M>(payload: PS, meta: MS): Readonly<ActionSuccess<T, PS, MS>>;
    <PS extends P>(payload: PS): Readonly<ActionSuccess<T, PS, null>>;
    <MS extends M>(payload: null | undefined, meta: MS): Readonly<ActionSuccess<T, null, MS>>;
    (): Readonly<ActionSuccess<T, null, null>>;
  }
}
