import Queue, { squashQueues } from '../helpers/Queue/Queue';
import Type from '../helpers/Type/Type';
import {
  GenericConfig,
  GenericMeta,
  GenericPayload,
  GenericState,
  GenericAction,
  GenericReducer,
  ReduxFluentReducer, PlainObject,
} from '../Types/Types';

export function $default(arg: GenericState | any, data: any): GenericReducer {
  squashQueues<ReduxFluentReducer, string>(data.caseQueue, data.doQueue, data.actions);

  const getDefaultState: ReduxFluentReducer = (state: GenericState, action: GenericAction): GenericState => (
    state || (Type.isFunction(arg) ? arg(state, action) : arg)
  );

  function reducer(state: GenericState, action: GenericAction): GenericState {
    return (data.actions[action.type] || [getDefaultState])
      .reduce((res: GenericState, predicate: ReduxFluentReducer) => predicate(res, action, data.config), state);
  }

  reducer.toString = () => data.domain;
  Object.defineProperty(reducer, 'domain', {
    enumerable: true,
    value: data.domain,
  });
  return reducer;
}

export function $case(action: GenericAction, data: any) {
  data.caseQueue.push(action.type || action.toString());

  return {
    case(action: GenericAction) {
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
    default(arg: GenericState | GenericReducer) {
      return $default(arg, data);
    },
    case(action: GenericAction) {
      squashQueues<ReduxFluentReducer, string>(data.caseQueue, data.doQueue, data.actions);

      return $case(action, data);
    },
  };
}

export function $caseAndDefault(data: any) {
  return {
    case(action: GenericAction) {
      return $case(action, data);
    },
    default(arg: GenericState | GenericReducer) {
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
    $caseAndDefault(data), {
      config(config: PlainObject) {
        (<any>data).config = config;

        return $caseAndDefault(data);
      },
    },
  );
}
