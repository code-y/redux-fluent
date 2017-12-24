import Queue, { squashQueues } from '../helpers/Queue/Queue';
import Type from '../helpers/Type/Type';
import {
  State,
  Action,
  Reducer,
  ReduxFluentReducer,
  PlainObject,
} from '../Types/Types';


export function $default(arg: State | ReduxFluentReducer, data: any): Reducer {
  squashQueues<ReduxFluentReducer, string>(data.caseQueue, data.doQueue, data.actions);

  function getDefaultState<S extends State, A extends Action>(state: S, action: A): S {
    return state || (Type.isFunction(arg) ? (<ReduxFluentReducer>arg)(state, action, data.config) : arg as State);
  }

  function reducer<S extends State, A extends Action>(state: S, action: A): S {
    return (data.actions[action.type] || [getDefaultState])
      .reduce((res: State, predicate: ReduxFluentReducer) => predicate(res, action, data.config), state);
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

export function $case(action: Action, data: any) {
  data.caseQueue.push(action.type || action.toString());

  return {
    case(action: Action) {
      return $case(action, data);
    },
    do(reducer: ReduxFluentReducer) {
      return $do(reducer, data);
    },
  };
}

export function $do(predicate: ReduxFluentReducer, data: any) {
  data.doQueue.push(predicate);

  return {
    do(reducer: ReduxFluentReducer) {
      return $do(reducer, data);
    },
    default(arg: State | ReduxFluentReducer) {
      return $default(arg, data);
    },
    case(action: Action) {
      squashQueues<ReduxFluentReducer, string>(data.caseQueue, data.doQueue, data.actions);

      return $case(action, data);
    },
  };
}

export function $caseAndDefault(data: any) {
  return {
    case(action: Action) {
      return $case(action, data);
    },
    default(arg: State | Reducer) {
      return $default(arg, data);
    },
  };
}

export default function CreateReducer(domain: string) {
  const data = {
    domain,
    actions: Object.create(null),
    caseQueue: Queue<string>(),
    doQueue: Queue<ReduxFluentReducer>(),
    config: void 0,
  };

  return Object.assign(
    $caseAndDefault(data),
    {
      config(config: PlainObject) {
        (<any>data).config = config;

        return $caseAndDefault(data);
      },
    },
  );
}
