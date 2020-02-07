// eslint-disable-next-line no-unused-vars
import { AnyAction } from 'redux';

type R<S, A, C> = <AA extends A>(state: S, action: AA, config: C) => S;
type PredicateWrapper = (t: string[], p: (a: AnyAction) => {}, a: AnyAction) => {};
const isFn = (arg: any) => typeof arg === 'function';

const matcher = (wrap: PredicateWrapper) => <S, A, C>(a1: any, a2?: any) => {
  const types = isFn(a1) ? [] : a1.types;
  // eslint-disable-next-line no-nested-ternary
  const predicate = isFn(a1) ? a1 : (
    isFn(a2) ? a2 : (() => true)
  );

  return {
    map: <S = any, A extends AnyAction = AnyAction, C = void>(map: R<S, A, C>) => (
      (state: S, action: A, config: C): S => (
        wrap(types, predicate, action) ? map(state, action, config) : state
      )
    ),
  };
};

export const when = matcher(
  (t, p, a) => (!t.length || t.includes(a.type)) && p(a),
);
export const unless = matcher(
  (t, p, a) => (t.length && !t.includes(a.type)) || !p(a),
);
