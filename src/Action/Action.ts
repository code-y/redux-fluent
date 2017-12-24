import { Action, ActionCreator, PlainObject } from '../Types/Types';


export default function ActionCreatorFactory<
  Payload extends PlainObject = {}, Meta extends PlainObject = {}
>(type: string): ActionCreator<Payload, Meta> {

  function actionCreator(payload?: Payload | Error, meta?: Meta): Action<Payload, Meta> {
    const action = Object.create(null);

    action.type = type;
    action.error = payload instanceof Error;
    action.meta = meta || null;
    action.payload = payload || null;

    return Object.freeze(action);
  }

  Object.defineProperties(actionCreator, {
    type: {
      enumerable: true,
      value: type,
    },
    toString: {
      enumerable: true,
      value: () => type,
    },
  });

  // @ts-ignore TS2322 `type` is missing: being defined via Object.defineProperty
  return actionCreator;
}
