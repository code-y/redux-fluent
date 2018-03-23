import { PRIVATE_KEY } from '../Helpers/PRIVATE_KEY';

const identity = arg => arg;
const actions = [];

export default function ActionCreatorFactory(rawType, payloadCreator, metaCreator) {
  const type = rawType.toString();

  if (process.env.NODE_ENV !== 'production') {
    if (actions.indexOf(type) > -1) {
      throw new TypeError(`[redux-fluent] Action "${type}" already exists.`);
    }

    actions.push(type);
  }

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
    [PRIVATE_KEY]: { value: 'action' },
  });

  return actionCreator;
}
