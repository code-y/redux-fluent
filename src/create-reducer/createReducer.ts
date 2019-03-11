// eslint-disable-next-line no-unused-vars
import { AnyAction } from 'redux';


type GetDefaultState<S = any, C = any> = (state: void, action: AnyAction, config: C) => S;

interface ReduxFluentActionHandler<S = any, C = any> {
  <A extends AnyAction>(state: S, action: A, config: C): S;
}

interface Context<S = any, C = any> {
  config: C,
  handlers: ReduxFluentActionHandler<S, C>[],
  getDefaultState: GetDefaultState<S, C>;
}

export interface ReduxFluentReducer<N extends string = string, S = any> {
  readonly type: N;
  (state: S | undefined, action: AnyAction): S;
}

export type RFR<N extends string = string, S = any> = ReduxFluentReducer<N, S>;
export type RFAH<S = any, C = any> = ReduxFluentActionHandler<S, C>;

const createContext = <S, C>(): Context<S, C> => ({
  config: undefined,
  getDefaultState: undefined,
  handlers: [],
});

export function createReducer<N extends string, S = any, C = void>(name: N) {
  const context = createContext<S, C>();
  const orDefault = (state: S | undefined, action: AnyAction, config: C): S => (
    state === undefined ? context.getDefaultState(undefined, action, config) : state
  );

  function $reducer(state: S | undefined, action: AnyAction): S {
    return context.handlers.reduce(
      ($state, handler) => handler($state, action, context.config),
      orDefault(state, action, context.config),
    );
  }

  Object.defineProperties($reducer, {
    /* private */ $$context: { value: context },
    name: { configurable: true, value: `reducer('${name}')` },
    type: { enumerable: true, value: name },
  });

  return {
    actions(...pipes: RFAH<S, C>[]) {
      context.handlers = pipes;

      return {
        default(getDefaultState: GetDefaultState<S, C> = () => null): RFR<N, S> {
          context.getDefaultState = getDefaultState;

          // @ts-ignore TS2322 property `type` is defined in Object.defineProperties($reducer, ...)
          return $reducer;
        },
      };
    },
  };
}
