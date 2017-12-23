import { createReducer } from '../redux-fluent';


describe('createReducer E2E', () => {
  function Action(type: string) {
    function creator(payload) {

      return { type, payload };
    }

    creator.toString = () => type;
    return creator;
  }

  it('Should handle a custom action', () => {
    const saySomething = Action('saySomething');
    const defaultState = { message: 'Hello Universe' };

    const logger = jasmine.createSpy().and.callFake(state => state);
    const setMessage = jasmine.createSpy().and.callFake((state, action, config) => {
      expect(config).toHaveProperty('logger', logger);

      return { ...state, message: action.payload };
    });
    const incrementEditsCount = jasmine.createSpy().and.callFake((state, action, config) => {
      expect(config).toHaveProperty('logger', logger);

      return { ...state, edits: (state.edits || 0) + 1 };
    });

    const reducer = createReducer('hello world')
      .config({ logger })

      .case(saySomething)
        .do(setMessage)
        .do(incrementEditsCount)
        .do(logger)

      .default(defaultState)
    ;

    const newMsg = 'Hello EveryBody';

    const initialState = reducer(null, { type: 'unknown action type' });
    expect(initialState).toEqual(defaultState);


    const firstEdit = reducer(initialState, saySomething(newMsg));
    expect(firstEdit).not.toEqual(defaultState);
    expect(firstEdit).toHaveProperty('message', newMsg);
    expect(firstEdit).toHaveProperty('edits', 1);

    expect(reducer(firstEdit, { type: 'unknown action type' })).toEqual(firstEdit);

    expect(setMessage).toHaveBeenCalled();
    expect(incrementEditsCount).toHaveBeenCalled();
    expect(logger).toHaveBeenCalledWith(firstEdit, saySomething(newMsg), { logger });
  });
});
