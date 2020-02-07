import sinon from 'sinon';
import { expect } from 'chai';
import { createAction } from './create-action';


describe('Action', () => {
  it('should export a function { createAction }', () => {
    expect(createAction)
      .to.be.a('function');
  });

  it('should have a name', () => {
    const type = 'foo';

    expect(createAction(type))
      .to.have.property('name', `action('${type}')`);
  });

  it('should have a type', () => {
    const type = 'bar';

    expect(createAction(type))
      .to.have.property('type', type);
  });

  it('toString() should return type', () => {
    const type = 'hello world';

    expect(createAction(type).toString())
      .to.equal(type);
  });

  describe('actionCreator', () => {
    it('should call creators with payload, meta, type', () => {
      const type = 'foo';
      const payloadCreator = sinon.spy();
      const metaCreator = sinon.spy();
      const action = createAction(type, payloadCreator, metaCreator);

      const payload = 'hello';
      const meta = 'world';
      action(payload, meta);

      expect(payloadCreator)
        .to.have.been.calledWith(payload, meta, type);
      expect(metaCreator)
        .to.have.been.calledWith(payload, meta, type);
    });

    it('should work with no creators', () => {
      const type = 'greetings';
      const say = createAction(type, null, null);

      const payload = 'hello';
      const meta = 'world';
      const action = say(payload, meta);

      expect(action)
        .to.have.property('payload', payload);
      expect(action)
        .to.have.property('meta', meta);
      expect(action)
        .to.have.property('type', type);
      expect(action)
        .to.have.property('error', false);
    });

    it('should handle errors', () => {
      const type = 'greetings';
      const say = createAction(type, null, null);

      const payload = new Error('something went wrong!!');
      const action = say(payload);

      expect(action)
        .to.have.property('payload', payload)
        .which.is.a('Error');
      expect(action)
        .to.have.property('type', type);
      expect(action)
        .to.have.property('error', true);
    });
  });
});
