// eslint-disable-next-line no-unused-vars
import { AnyAction } from 'redux';
// eslint-disable-next-line no-unused-vars
import { ActionCreator, RFA } from '../create-action/createAction';


type AnyType<T extends string> = (T | ActionCreator<T, any, any> | { [key: string]: any, type: T });
type R<S, A, C> = <AA extends A>(state: S, action: AA, config: C) => S;
type Map<A> = <S = any, C = any>(fn: R<S, A, C>) => R<S, A, C>;

interface OfType {
  <T extends string, P, M>(action: ActionCreator<T, P, M>): {
    map: Map<RFA<T, P, M>>,
  };
  <T extends string>(type: AnyType<T>): {
    map: Map<RFA<T>>,
  };
  (arg: AnyType<string>, ...rest: AnyType<string>[]): {
    map: Map<RFA>,
  };
}

const $map = (types: string[], predicate) => <S = any, A extends AnyAction = AnyAction, C = void>(map: R<S, A, C>) => (
  (state: S, action: A, config: C): S => (
    types.includes(action.type) && predicate(state, action, config) ? map(state, action, config) : state
  )
);

export const ofType: OfType = (...args: any[]) => {
  const types = args.map(a => a.type || a.toString());

  return {
    map: $map(types, () => true),
    unless: (predicate) => ({
      map: $map(types, (state, action, config) => !predicate(state, action, config)),
    }),
    when: (predicate) => ({
      map: $map(types, predicate),
    }),
  };
};
