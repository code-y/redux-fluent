// eslint-disable-next-line no-unused-vars
import { FSA } from 'flux-standard-action';


export interface ReduxFluentAction<
  T extends string = string,
  P = any,
  M = any,
> extends FSA<P, M> {
  type: T;
  error: boolean;
}

type Formatter<T, R> = (rawPayload: any, rawMeta: any, T: T) => R;
export type RFA<T extends string = string, P = any, M = any> = ReduxFluentAction<T, P, M>;

export interface ActionCreator<T extends string, P, M> {
  (rawPayload?: any, rawMeta?: any): RFA<T, P, M>;
  type: T;
}

export function createAction<T extends string = string, P = void, M = void>(
  type: T,
  payloadCreator?: Formatter<T, P>,
  metaCreator?: Formatter<T, M>,
): ActionCreator<T, P, M> {
  const $payloadCreator = payloadCreator || (p => p);
  const $metaCreator = metaCreator || ((_, m) => m);

  function $action(rawPayload?: any, rawMeta?: any): RFA<T, P, M> {
    const payload: P = $payloadCreator(rawPayload, rawMeta, type);
    const meta: M = $metaCreator(rawPayload, rawMeta, type);

    const res: RFA<T, P, M> = {
      type,
      error: payload instanceof Error,
    };

    if (payload !== undefined) {
      res.payload = payload;
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

  // @ts-ignore TS2322 property `type` is defined in Object.defineProperties($action, ...)
  return $action;
}
