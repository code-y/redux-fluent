/* eslint-disable no-use-before-define */
import Queue, { squashQueues } from '../Helpers/Queue/Queue';
import { isFunction } from '../Helpers/Type/Type';

export default function CreateReducerFactory(domain) {
  const data = {
    domain,
    actions: Object.create(null),
    caseQueue: Queue(),
    doQueue: Queue(),
    config: Object.create(null),
  };

  return {
    case(action) { return $case(action, data); },
    default(arg) { return $default(arg, data); },

    config(config) {
      data.config = config;

      return {
        case(action) { return $case(action, data); },
        default(arg) { return $default(arg, data); },
      };
    },
  };
}

function $reducer(getDefaultState, data) {
  function reducer(state, action) {
    return (data.actions[action ? action.type : action] || [getDefaultState])
      .reduce((res, predicate) => predicate(res, action, data.config), state);
  }

  Object.defineProperties(reducer, {
    domain: { enumerable: true, value: data.domain },
    toString: { enumerable: true, value: () => data.domain },
  });

  return reducer;
}

function $default(arg, data) {
  squashQueues(data.caseQueue, data.doQueue, data.actions);

  function getDefaultState(state, action) {
    return state || (
      isFunction(arg)
        ? arg(state, action, data.config)
        : (arg || Object.create(null))
    );
  }

  return $reducer(getDefaultState, data);
}

function $case(currentAction, data) {
  data.caseQueue.push(currentAction.type || currentAction.toString());

  return {
    case(action) { return $case(action, data); },
    do(reducer) { return $do(reducer, data); },
  };
}

function $do(predicate, data) {
  data.doQueue.push(predicate);

  return {
    do(reducer) { return $do(reducer, data); },
    default(arg) { return $default(arg, data); },
    case(action) {
      squashQueues(data.caseQueue, data.doQueue, data.actions);

      return $case(action, data);
    },
  };
}
