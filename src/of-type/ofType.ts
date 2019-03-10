// eslint-disable-next-line no-unused-vars
import { AnyAction } from 'redux';
// eslint-disable-next-line no-unused-vars
import { ActionCreator, RFA } from '../create-action/createAction';

type WithType<T extends string = string> = { [key: string]: any, type: T };
type AnyType = (string | ActionCreator<string, any, any> | WithType);
type R<S, A, C> = <AA extends A>(state: S, action: AA, config: C) => S;
type Map<A> = <S = any, C = any>(fn: R<S, A, C>) => R<S, A, C>;

interface OfType {
  <T extends string, P, M>(action: ActionCreator<T, P, M>): {
    map: Map<RFA<T, P, M>>,
  };
  <T extends string>(type: T): {
    map: Map<RFA<T>>,
  };
  <T extends string>(withType: WithType<T>): {
    map: Map<RFA<T>>,
  };
  (arg: AnyType, ...rest: AnyType[]): {
    map: Map<RFA>,
  };
}

export const ofType: OfType = (arg: any, ...args: any[]) => {
  const types = [arg].concat(args).map(a => a.type || a.toString());

  return {
    map: <S = any, A extends AnyAction = AnyAction, C = any>(map: R<S, A, C>) => (
      (state: S, action: A, config: C): S => (
        types.includes(action.type) ? map(state, action, config) : state
      )
    ),
  };
};
