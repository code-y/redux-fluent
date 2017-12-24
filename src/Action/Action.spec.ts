import { createAction } from '../redux-fluent';
import { Meta, Payload } from '../Types/Types';

describe('createAction', () => {
  interface ExamplePayload extends Payload {
    test: string;
  }

  interface ExampleMeta extends Meta {
    test: string;
  }

  const type = '@@test/todos:add';
  const payload: ExamplePayload = { test: 'test' };
  const meta: ExampleMeta = { test: 'test' };

  it('Factory should return a function actionCreator', () => {
    expect(
      createAction('test'),
    ).toEqual(jasmine.any(Function));
  });

  describe('actionCreator', () => {
    it('should have a property type', () => {
      const type = '@@test';
      expect(
        createAction(type),
      ).toHaveProperty('type', type);
    });

    it('should have a property toString', () => {
      expect(
        createAction('test'),
      ).toHaveProperty('toString', jasmine.any(Function));
    });

    it('toString() should return type', () => {
      const type = '@@test';
      expect(
        createAction(type).toString(),
      ).toEqual(type);
    });

    it('should return an action', () => {
      const actionCreator = createAction<ExamplePayload, ExampleMeta>(type);
      const action = actionCreator({ test: 'hello world' });

      expect(
        action,
      ).toEqual(jasmine.any(Object));

      expect(
        action.payload,
      ).not.toEqual(jasmine.any(Error));

      expect(
        action.error,
      ).toEqual(false);
    });

    it('should return an action error if Payload = Error', () => {
      const actionCreator = createAction<ExamplePayload, ExampleMeta>(type);
      const action = actionCreator(new Error('hello world'));

      expect(
        action,
      ).toEqual(jasmine.any(Object));

      expect(
        action.payload,
      ).toEqual(jasmine.any(Error));

      expect(
        action.error,
      ).toEqual(true);
    });
  });

  describe('action', () => {
    const actionCreator = createAction<ExamplePayload, ExampleMeta>(type);

    it('should have property [payload = payload]', () => {
      expect(
        actionCreator(payload, meta),
      ).toHaveProperty('payload', jasmine.any(Object));

      expect(
        actionCreator(payload, meta),
      ).toHaveProperty('payload', payload);
    });

    it('should have property [meta = meta]', () => {
      expect(
        actionCreator(payload, meta),
      ).toHaveProperty('meta', jasmine.any(Object));
      expect(
        actionCreator(payload, meta),
      ).toHaveProperty('meta', meta);
    });

    it('should have property [error = false]', () => {
      expect(
        actionCreator(payload, meta),
      ).toHaveProperty('error', jasmine.any(Boolean));

      expect(
        actionCreator(payload, meta),
      ).toHaveProperty('error', false);
    });

    it('should have property [type = type]', () => {
      expect(
        actionCreator(payload, meta),
      ).toHaveProperty('type', jasmine.any(String));

      expect(
        actionCreator(payload, meta),
      ).toHaveProperty('type', type);
    });
  });
});
