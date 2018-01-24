const identity = arg => arg;

export default function ActionCreatorFactory(type, payloadCreator, metaCreator) {
  const pCreator = payloadCreator || identity;
  const mCreator = metaCreator || identity;

  function actionCreator(rawPayload, rawMeta) {
    const action = Object.create(null);

    const payload = pCreator(rawPayload) || null;
    const meta = mCreator(rawMeta) || null;

    action.type = type;
    action.error = payload instanceof Error;
    action.meta = meta;
    action.payload = payload;

    return Object.freeze(action);
  }

  Object.defineProperties(actionCreator, {
    type: { enumerable: true, value: type },
    toString: { enumerable: true, value: () => type },
  });

  return actionCreator;
}
