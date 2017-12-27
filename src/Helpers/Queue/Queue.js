export default function Queue() {
  let queue = [];

  return {
    push(...arg) { queue = queue.concat(arg); },
    forEach(callback) { queue.forEach(callback); },
    flush() { queue = []; },
  };
}

export function squashQueues(queue1, queue2, accumulator) {
  queue1.forEach(type => (
    queue2.forEach((predicate) => {
      // eslint-disable-next-line no-param-reassign
      accumulator[type] = (accumulator[type] || []).concat(predicate);
    })
  ));

  queue2.flush();
  queue1.flush();
}
