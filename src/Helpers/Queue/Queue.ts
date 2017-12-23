export default function Queue<T>() {
  let queue: T[] = [];

  return {
    push(...arg: T[]) { queue = queue.concat(arg); },
    forEach(callback: () => {}) { queue.forEach(callback); },
    flush() { queue = []; },
  };
}

export function squashQueues<P, T>(queue1: any, queue2: any, accumulator: any) {
  queue1.forEach((type: T) => queue2.forEach((predicate: P) => {
    accumulator[type] = (accumulator[type] || []).concat(predicate);
  }));

  queue2.flush();
  queue1.flush();
}
