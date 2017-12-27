import Queue from './Queue';

describe('Queue', () => {
  it('method push should add to the queue', () => {
    const spy = jasmine.createSpy();
    const item = 'foobaz';
    const queue = Queue();

    queue.push(item);
    queue.forEach(spy);

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(
      item,
      jasmine.any(Number),
      jasmine.any(Array),
    );
  });

  it('method flush should reset the queue', () => {
    const spy = jasmine.createSpy();
    const item = 'foobaz';
    const queue = Queue();

    queue.push(item);
    queue.flush();
    queue.forEach(spy);

    expect(spy).not.toHaveBeenCalled();
  });
});
