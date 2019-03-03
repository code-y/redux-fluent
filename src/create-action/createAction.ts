// eslint-disable-next-line no-unused-vars
import { FSA } from 'flux-standard-action';
// eslint-disable-next-line no-unused-vars
import { AnyAction } from 'redux';


export interface CreateAction<
  T extends string = string,
  P = any,
  M = any,
> extends FSA<P, M> {
  type: T;
}

export type RFA<T extends string = string, P = any, M = any> = CreateAction<T, P, M>;

export interface ActionCreator<T extends string, P, M> {
  (rawPayload?: any, rawMeta?: any): CreateAction<T, P, M>;
  type: T;
}

export function createAction<P = void, M = void, T extends string = string>(
  type: T,
  payloadCreator?: (rawPayload: any, rawMeta: any, type: T) => P,
  metaCreator?: (rawPayload: any, rawMeta: any, type: T) => M,
): ActionCreator<T, P, M> {
  // eslint-disable-next-line no-unused-vars
  const $payloadCreator = payloadCreator || ((p, m, t) => p);
  // eslint-disable-next-line no-unused-vars
  const $metaCreator = metaCreator || ((p, m, t) => m);

  function $action(rawPayload?: any, rawMeta?: any) {
    const payload: P = $payloadCreator(rawPayload, rawMeta, type);
    const meta: M = $metaCreator(rawPayload, rawMeta, type);

    const res: AnyAction = { type };

    if (payload !== undefined) {
      res.payload = payload;
      res.error = payload instanceof Error;
    }

    if (meta !== undefined) {
      res.meta = meta;
    }

    return Object.freeze(res);
  }

  Object.defineProperties($action, {
    name: { configurable: true, value: `action('${type}')` },
    toString: { value: () => type },
    type: { enumerable: true, value: type },
  });

  // property `type` is defined in Object.defineProperties($action, ...)
  // @ts-ignore TS2322
  return $action;
}
