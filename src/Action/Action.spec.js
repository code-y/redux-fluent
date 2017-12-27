import { createAction } from '../redux-fluent';

describe('createAction', () => {
  const type = '@@test/todos:add';
  const payload = { test: 'test' };
  const meta = { test: 'test' };

  it('Factory should return a function actionCreator', () => {
    expect(createAction('test')).toEqual(jasmine.any(Function));
  });

  describe('actionCreator', () => {
    it('should have a property type', () => {
      expect(createAction(type)).toHaveProperty('type', type);
    });

    it('should have a property toString', () => {
      expect(createAction('test')).toHaveProperty('toString', jasmine.any(Function));
    });

    it('toString() should return type', () => {
      expect(createAction(type).toString()).toEqual(type);
    });

    it('should return an action', () => {
      const actionCreator = createAction(type);
      const action = actionCreator();

      expect(action).toEqual({
        type,
        error: false,
        payload: null,
        meta: null,
      });

      expect(action.payload).not.toEqual(jasmine.any(Error));

      expect(action.error).toEqual(false);
    });

    it('should return an action error if Payload = Error', () => {
      const actionCreator = createAction(type);
      const action = actionCreator(new Error('hello world'));

      expect(action).toEqual(jasmine.any(Object));

      expect(action.payload).toEqual(jasmine.any(Error));

      expect(action.error).toEqual(true);
    });
  });

  describe('action', () => {
    const actionCreator = createAction(type);
    const macro = (prop, val, Type) => () => {
      expect(actionCreator(payload, meta))
        .toHaveProperty(prop, jasmine.any(Type));

      expect(actionCreator(payload, meta))
        .toHaveProperty(prop, val);
    };

    it('should have property [payload = payload]', macro('payload', payload, Object));
    it('should have property [meta = meta]', macro('meta', meta, Object));
    it('should have property [error = error]', macro('error', false, Boolean));
    it('should have property [type = type]', macro('type', type, String));
  });
});
