import {
  ACTION_TYPE,
  GenericMeta,
  GenericAction,
  GenericPayload,
  ActionCreator,
} from '../Types/Types';

export default function ActionCreator<P = GenericPayload, M = GenericMeta>(type: ACTION_TYPE): ActionCreator<P, M> {
  function actionCreator(payload: P | null = null, meta: M | null = null): GenericAction<P, M> {
    const action = Object.create(null);

    action.payload = payload;
    action.meta = meta;
    action.error = payload instanceof Error;

    Object.defineProperty(action, 'type', {
      enumerable: true,
      value: type,
    });

    return action;
  }

  actionCreator.toString = () => type;
  Object.defineProperty(actionCreator, 'type', {
    enumerable: true,
    value: type,
  });

  // @ts-ignore TS2322 `type` is missing: being defined via Object.defineProperty
  return actionCreator;
}
