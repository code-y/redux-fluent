import { isFSA, isError } from 'flux-standard-action';
import { createAction } from './redux-fluent';

describe('Flux Standard Action Compliance', () => {
  it('redux fluent actions should be valid Flux Standard Actions', () => {
    const addTodo = createAction('@@todos | add');

    expect(isFSA(addTodo({ title: 'Walk Gipsy' }))).toBe(true);
    expect(isError(addTodo({ title: 'Walk Gipsy' }))).toBe(false);

    expect(isFSA(addTodo({}, { date: new Date() }))).toBe(true);
    expect(isError(addTodo({}, { date: new Date() }))).toBe(false);
  });

  it('redux fluent error actions should be valid Flux Standard Actions', () => {
    const addTodo = createAction('@@todos | add');

    expect(isFSA(addTodo(new Error('unable to add todo')))).toBe(true);
    expect(isError(addTodo(new Error('unable to add todo')))).toBe(true);

    expect(isFSA(addTodo(new Error(), { reason: 'Too many things to do' }))).toBe(true);
    expect(isError(addTodo(new Error(), { reason: 'Too many things to do' }))).toBe(true);
  });
});
