// eslint-disable-next-line no-unused-vars
import { AnyAction } from 'redux';


interface ActionHandler<S, C> {
  (state: S, action: any, config: C): S;
}

interface ReducerContext<S, C> {
  config: any,
  handlers: ActionHandler<S, C>[],
  getDefaultState: () => S;
}

export interface CreateReducer<N extends string = string, S = any> {
  readonly type: N;
  (state: S | undefined, action: AnyAction): S;
}

const Context = <S, C>(): ReducerContext<S, C> => ({
  config: undefined,
  getDefaultState: undefined,
  handlers: [],
});

export function createReducer<N extends string, S = any, C = any>(name: N) {
  const context = Context<S, C>();
  const orDefault = (state: S | undefined): S => (
    state === undefined ? context.getDefaultState() : state
  );

  function $reducer(state: S | undefined, action: AnyAction): S {
    return context.handlers.reduce(
      ($state, pipe) => pipe($state, action, context.config),
      orDefault(state),
    );
  }

  Object.defineProperties($reducer, {
    /* private */ $$context: { value: context },
    name: { configurable: true, value: `reducer('${name}')` },
    type: { enumerable: true, value: name },
  });

  return {
    actions(...pipes: ActionHandler<S, C>[]) {
      context.handlers = pipes;

      return {
        default(getDefaultState: () => S = () => null): CreateReducer<N, S> {
          context.getDefaultState = getDefaultState;

          // property `type` is defined in Object.defineProperties($reducer, ...)
          // @ts-ignore TS2322
          return $reducer;
        },
      };
    },
  };
}
