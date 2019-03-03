import { createReducer } from '../create-reducer/createReducer';


export const withConfig = <S, N extends string>(config: object) => (reducer: any) => {
  const { $$context, type } = reducer;

  const newReducer = createReducer<N, S>(type)
    .actions(...$$context.handlers)
    .default($$context.getDefaultState);

  // @ts-ignore TS2339
  newReducer.$$context.config = Object.assign(
    {},
    $$context.config || {},
    config,
  );

  Object.defineProperty(newReducer, 'name', {
    configurable: true,
    value: `withConfig(${reducer.name})`,
  });

  return newReducer;
};
