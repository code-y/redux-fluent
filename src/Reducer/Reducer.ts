import Queue, { IQueue, squashQueues } from '../helpers/Queue/Queue';
import Type from '../helpers/Type/Type';
import {
  Action, ActionCreator,
  PlainObject,
  ReduxFluentReducer,
} from '../Types/Types';


interface ReducerData<State> {
  domain: string;
  actions: {
    [index: string]: ReduxFluentReducer<State>[];
  };
  caseQueue: IQueue<string>;
  doQueue: IQueue<ReduxFluentReducer<State>>;
  config?: {};
}

function $default<State>(arg: State | ReduxFluentReducer<State>, data: ReducerData<State>) {
  squashQueues<ReduxFluentReducer<State>, string>(data.caseQueue, data.doQueue, data.actions);

  function getDefaultState(state: State, action: Action): State {
    return state as State || (
      Type.isFunction(arg)
        ? (<ReduxFluentReducer<State>>arg)(state, action, data.config)
        : arg as State
    );
  }

  function reducer(state: State, action: Action): State {
    return (data.actions[action ? action.type : action] || [getDefaultState])
      .reduce((res: State, predicate: ReduxFluentReducer<State>) => predicate(res, action, data.config), state);
  }

  Object.defineProperties(reducer, {
    domain: {
      enumerable: true,
      value: data.domain,
    },
    toString: {
      enumerable: true,
      value: () => data.domain,
    },
  });

  return reducer;
}

function $case<State>(action: Action | ActionCreator, data: ReducerData<State>) {
  data.caseQueue.push(action.type || action.toString());

  return {
    case(action: Action | ActionCreator) {
      return $case(action, data);
    },
    do(reducer: ReduxFluentReducer<State>) {
      return $do(reducer, data);
    },
  };
}

function $do<State>(predicate: ReduxFluentReducer<State>, data: ReducerData<State>) {
  data.doQueue.push(predicate);

  return {
    do(reducer: ReduxFluentReducer<State>) {
      return $do<State>(reducer, data);
    },
    default(arg: State | ReduxFluentReducer<State>) {
      return $default<State>(arg, data);
    },
    case(action: Action | ActionCreator) {
      squashQueues<ReduxFluentReducer<State>, string>(data.caseQueue, data.doQueue, data.actions);

      return $case<State>(action, data);
    },
  };
}

function $caseAndDefault<State>(data: ReducerData<State>) {
  return {
    case(action: Action | ActionCreator) {
      return $case<State>(action, data);
    },
    default(arg: State | ReduxFluentReducer<State>) {
      return $default<State>(arg, data);
    },
  };
}

export default function CreateReducer<State>(domain: string) {
  const data: ReducerData<State> = {
    domain,
    actions: Object.create(null),
    caseQueue: Queue<string>(),
    doQueue: Queue<ReduxFluentReducer<State>>(),
    config: void 0,
  };

  return Object.assign(
    $caseAndDefault<State>(data),
    {
      config(config?: PlainObject) {
        data.config = config;

        return $caseAndDefault<State>(data);
      },
    },
  );
}
