import Queue, { squashQueues } from '../Helpers/Queue/Queue';
import Type from '../Helpers/Type/Type';
import {
  Action, ActionCreator,
  ReduxFluentReducer,
  ReducerData,
  PlainObject,
} from '../Types/Types';

function $default<State, Config>(arg: State | ReduxFluentReducer<State>, data: ReducerData<State, Config>) {
  squashQueues<ReduxFluentReducer<State>, string>(data.caseQueue, data.doQueue, data.actions);

  function getDefaultState(state: State, action: Action): State {
    return state as State || (
      Type.isFunction(arg)
        ? (<ReduxFluentReducer<State, Action>>arg)(state, action, data.config)
        : arg as State
    );
  }

  function reducer(state: State, action: Action): State {
    return (data.actions[action ? action.type : action] || [getDefaultState])
      .reduce(
        (res: State, predicate: ReduxFluentReducer<State, Action>) => predicate(res, action, data.config),
        state,
      )
    ;
  }

  Object.defineProperties(reducer, {
    domain: { enumerable: true, value: data.domain },
    toString: { enumerable: true, value: () => data.domain },
  });

  return reducer;
}

function $case<State, Config>(action: Action | ActionCreator, data: ReducerData<State, Config>) {
  data.caseQueue.push(action.type || action.toString());

  return {
    case(action: Action | ActionCreator) {
      return $case<State, Config>(action, data);
    },
    do(reducer: ReduxFluentReducer<State>) {
      return $do<State, Config>(reducer, data);
    },
  };
}

function $do<State, Config>(predicate: ReduxFluentReducer<State>, data: ReducerData<State, Config>) {
  data.doQueue.push(predicate);

  return {
    do(reducer: ReduxFluentReducer<State>) {
      return $do<State, Config>(reducer, data);
    },
    default(arg: State | ReduxFluentReducer<State>) {
      return $default<State, Config>(arg, data);
    },
    case(action: Action | ActionCreator) {
      squashQueues<ReduxFluentReducer<State>, string>(data.caseQueue, data.doQueue, data.actions);

      return $case<State, Config>(action, data);
    },
  };
}

function $caseAndDefault<State, Config>(data: ReducerData<State, Config>) {
  return {
    case(action: Action | ActionCreator) {
      return $case<State, Config>(action, data);
    },
    default(arg: State | ReduxFluentReducer<State>) {
      return $default<State, Config>(arg, data);
    },
  };
}

export default function CreateReducer<State, Config = undefined>(domain: string) {
  const data: ReducerData<State, Config> = {
    domain,
    actions: Object.create(null),
    caseQueue: Queue<string>(),
    doQueue: Queue<ReduxFluentReducer<State>>(),
    config: void 0,
  };

  return Object.assign(
    $caseAndDefault<State, Config>(data),
    {
      config(config?: Config) {
        data.config = config;

        return $caseAndDefault<State, Config>(data);
      },
    },
  );
}
