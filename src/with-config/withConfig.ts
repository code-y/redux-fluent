// eslint-disable-next-line no-unused-vars
import { createReducer, ReduxFluentReducer } from '../create-reducer/createReducer';


// eslint-disable-next-line arrow-parens,max-len
export const withConfig = <C = any>(config: C) => <N extends string, S = any, CC = any>(reducer: ReduxFluentReducer<N, S>) => {
  // @ts-ignore $$context is a private property
  const { $$context, type } = reducer;

  const $reducer = createReducer<N, S, CC & C>(type)
    .actions(...$$context.handlers)
    .default($$context.getDefaultState);

  // @ts-ignore TS2339
  $reducer.$$context.config = Object.assign(
    {},
    $$context.config || {},
    config,
  );

  Object.defineProperty($reducer, 'name', {
    configurable: true,
    value: `withConfig(${reducer.name})`,
  });

  return $reducer;
};
