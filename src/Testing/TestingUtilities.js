import createCombinableReducers from '../CombinableReducers/CombinableReducers';
import { PRIVATE_KEY } from '../Helpers/PRIVATE_KEY';

export const patchReducerConfig = (reducer, config = {}) => {
  if (!reducer || reducer[PRIVATE_KEY] !== 'reducer') {
    throw new TypeError('argument reducer must be a redux-fluent reducer');
  }

  const copy = reducer.bind({
    [PRIVATE_KEY]: { config },
  });

  copy.domain = reducer.domain;
  copy[PRIVATE_KEY] = reducer[PRIVATE_KEY];
  copy.toString = reducer.toString;

  return copy;
};

export const createFakeStore = (...reducers) => {
  const rootReducer = createCombinableReducers(...reducers);
  let state = Object.create(null);

  const getState = () => state;
  const dispatch = (action) => {
    const newState = Object.create(null);

    // eslint-disable-next-line no-restricted-syntax
    for (const domain in rootReducer) {
      if (!({}).hasOwnProperty.call(rootReducer, domain)) {
        // eslint-disable-next-line no-continue
        continue;
      }

      newState[domain] = rootReducer[domain](state[domain] || null, action);
    }

    state = newState;
    return {
      getState,
      dispatch,
    };
  };

  return dispatch({ type: '@@INIT' });
};
