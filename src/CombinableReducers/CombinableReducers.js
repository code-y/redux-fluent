export default (...reducers) => reducers
  .reduce((res, reducer) => {
    const domain = reducer.domain || reducer.toString();

    if (process.env.NODE_ENV !== 'production') {
      if (domain in res) {
        throw new TypeError(`[redux-fluent] Reducer "${domain}" already exists.`);
      }
    }

    res[domain] = reducer;
    return res;
  }, Object.create(null));
