export default function ActionCreatorFactory(type) {
  function actionCreator(payload, meta) {
    const action = Object.create(null);

    action.type = type;
    action.error = payload instanceof Error;
    action.meta = meta || null;
    action.payload = payload || null;

    return Object.freeze(action);
  }

  Object.defineProperties(actionCreator, {
    type: { enumerable: true, value: type },
    toString: { enumerable: true, value: () => type },
  });

  return actionCreator;
}
