import createCombinableReducers from '../CombinableReducers/CombinableReducers';


export default function createFakeStore(...reducers) {
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
}
