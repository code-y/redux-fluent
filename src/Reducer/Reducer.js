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
    case: action => $case(action, data),
    default: arg => $default(arg, data),

    config(config) {
      data.config = config;

      return {
        case: action => $case(action, data),
        default: arg => $default(arg, data),
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

function $then(success, error, data) {
  const doSuccess = success && $do((s, a, c) => (a.error ? s : success(s, a, c)), data);
  const doError = error && $do((s, a, c) => (a.error ? error(s, a, c) : s), data);

  return doError || doSuccess;
}

function $case(currentAction, data) {
  data.caseQueue.push(currentAction.type || currentAction.toString());

  return {
    case: action => $case(action, data),
    do: reducer => $do(reducer, data),
    then: (success, error) => $then(success, error, data),
    catch: error => $then(null, error, data),
  };
}

function $do(predicate, data) {
  data.doQueue.push(predicate);

  return {
    do: reducer => $do(reducer, data),
    then: (success, error) => $then(success, error, data),
    catch: error => $then(null, error, data),
    default: arg => $default(arg, data),
    case(action) {
      squashQueues(data.caseQueue, data.doQueue, data.actions);

      return $case(action, data);
    },
  };
}
