// eslint-disable-next-line no-unused-vars
import { createReducer, ReduxFluentReducer } from '../create-reducer/createReducer';


// eslint-disable-next-line arrow-parens,max-len
export const withConfig = <CC = any>(config: CC) => <N extends string, S = any, C = any>(reducer: ReduxFluentReducer<N, S>) => {
  // @ts-ignore $$context is a private property
  const { $$context, type } = reducer;

  const $reducer = createReducer<N, S, C & CC>(type)
    .actions(...$$context.handlers)
    .default($$context.getDefaultState);

  // @ts-ignore TS2339
  $reducer.$$context.config = {

    ...($$context.config || {}),
    ...config,
  };

  Object.defineProperty($reducer, 'name', {
    configurable: true,
    value: `withConfig(${reducer.name})`,
  });

  return $reducer;
};
