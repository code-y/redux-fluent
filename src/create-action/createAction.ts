// eslint-disable-next-line no-unused-vars
import { ErrorFSA, FSA } from 'flux-standard-action';


export interface ReduxFluentAction<
  T extends string = string,
  P = void,
  M = void,
> extends FSA<T, P, M> {
  type: T;
}

export interface ReduxFluentActionError<
  T extends string = string,
  E extends Error = Error,
  M = void,
  > extends ErrorFSA<E, M> {
  type: T;
}

type Formatter<T, R> = (rawPayload: any, rawMeta: any, T: T) => R;
export type RFA<T extends string = string, P = any, M = any> = ReduxFluentAction<T, P, M>;
export type RFAE<T extends string = string, P extends Error = Error, M = any> = ReduxFluentActionError<T, P, M>;

export interface ActionCreator<T extends string, P, M> {
  readonly type: T;
  <E extends Error = Error, RM = any>(rawPayload?: E, rawMeta?: RM): RFAE<T, E, M>
  <RP = any, RM = any>(rawPayload?: RP, rawMeta?: RM): RFA<T, P, M>;
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

    const action: RFA<T, P, M> = { type };

    if (payload !== undefined) {
      action.error = payload instanceof Error;
      action.payload = payload;
    }

    if (meta !== undefined) {
      action.meta = meta;
    }

    return Object.freeze(action);
  }

  Object.defineProperties($action, {
    name: { configurable: true, value: `action('${type}')` },
    toString: { value: () => type },
    type: { enumerable: true, value: type },
  });

  // @ts-ignore TS2322 property `type` is defined in Object.defineProperties($action, ...)
  return $action;
}
