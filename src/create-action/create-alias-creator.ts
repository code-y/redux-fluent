// eslint-disable-next-line no-unused-vars
import { createAction, Formatter } from './create-action';

export const createAliasCreator = <T extends string = string, P = void, M = void>(
  type: T,
) => (payloadCreator?: Formatter<T, P>, metaCreator?: Formatter<T, M>) => createAction<T, P, M>(
  type,
  payloadCreator,
  metaCreator,
);
