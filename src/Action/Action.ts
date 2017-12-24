import {
  ACTION_TYPE, Action,
  ActionCreator, Payload, Meta,
} from '../Types/Types';

export default function ActionCreatorFactory<P = Payload, M = Meta>(
  type: ACTION_TYPE,
): ActionCreator<P, M> {

  function actionCreator(payload?: P, meta?: M): Action<P, M> {
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
