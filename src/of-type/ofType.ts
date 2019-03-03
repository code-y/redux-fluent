// eslint-disable-next-line no-unused-vars
import { ActionCreator, RFA } from '../create-action/createAction';

type WithType<T extends string = string> = { [key: string]: any, type: T };
type AnyType = (string | ActionCreator<string, any, any> | WithType);
type R<S, A, C> = (state: S, action: A, config: C) => S;
type P<S, A, C> = (state: S, action: A, config: C) => any;
type Map<A> = <S = any, C = any>(fn: R<S, A, C>) => R<S, A, C>;
type Filter<A> = <S = any, C = any>(fn: P<S, A, C>) => { map: Map<A> };

interface OfType {
  <T extends string, P, M>(action: ActionCreator<T, P, M>): {
    map: Map<RFA<T, P, M>>,
    filter: Filter<RFA<T, P, M>>
  };
  <T extends string>(type: T): {
    map: Map<RFA<T>>,
    filter: Filter<RFA<T>>
  };
  <T extends string>(withType: WithType<T>): {
    map: Map<RFA<T>>,
    filter: Filter<RFA<T>>
  };
  (arg: AnyType, ...rest: AnyType[]): {
    map: Map<RFA>,
    filter: Filter<RFA>
  };
}

const $filter = <A extends RFA>(types: string[]) => <S, C>(predicate: P<S, A, C>) => ({
  map: (map: R<S, A, C>) => (state: S, action: A, config: C): S => (
    types.includes(action.type) && predicate(state, action, config)
      ? map(state, action, config)
      : state
  ),
});

// @ts-ignore
export const ofType: OfType = (arg: any, ...args: any[]) => {
  const types = [arg].concat(args).map(a => a.type || a.toString());
  const filter = $filter(types);

  return Object.assign({}, filter(() => true), {
    filter,
  });
};
