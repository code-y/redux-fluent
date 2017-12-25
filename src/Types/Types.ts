export interface PlainObject {
  [key: string]: any;
}

export interface Action<Payload = PlainObject, Meta = PlainObject, isError extends boolean = false> {
  readonly type: string;
  readonly error: isError;
  readonly payload: Payload;
  readonly meta: Meta;
}

export interface ActionCreator<Payload = PlainObject, Meta = PlainObject> {
  readonly type: string;

  toString(): string;

  (payload: Error, meta: Meta): Action<Error, Meta, true>;

  (payload: Error): Action<Error, null, true>;

  (payload: Payload, meta: Meta): Action<Payload, Meta>;

  (payload: Payload): Action<Payload, null>;

  (): Action<null, null>;
}

export interface Reducer<State = PlainObject, Action = Action> {
  (state: State, action: Action): State;
}

export interface ReduxFluentReducer<State extends PlainObject, Action = Action, Config = PlainObject | undefined> {
  (state: State, action: Action, config: Config): State;
}

export interface IQueue<T> {
  push(...arg: T[]): void;

  forEach(callback?: (t: T, i: number, list: T[]) => void): void;

  flush(): void;
}

export interface ReducerData<State, Config extends PlainObject | undefined> {
  domain: string;
  actions: {
    [index: string]: ReduxFluentReducer<State>[];
  };
  caseQueue: IQueue<string>;
  doQueue: IQueue<ReduxFluentReducer<State>>;
  config?: Config;
}
