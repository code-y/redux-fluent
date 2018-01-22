export default (...reducers) => reducers
  .reduce((res, reducer) => {
    const domain = reducer.domain || reducer.toString();

    if (domain in res) {
      throw new TypeError(`[redux-fluent] Reducer "${domain}" was already registered.`);
    }

    res[domain] = reducer;
    return res;
  }, Object.create(null));
