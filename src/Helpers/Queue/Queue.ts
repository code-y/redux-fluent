export interface IQueue<T> {
  push(...arg: T[]): void;

  forEach(callback?: (t: T, i: number, list: T[]) => void): void;

  flush(): void;
}

export default function Queue<T>(): IQueue<T> {
  let queue: T[] = [];

  return {
    push(...arg: T[]) { queue = queue.concat(arg); },
    forEach(callback: (t: T, i: number, list: T[]) => void) { queue.forEach(callback); },
    flush() { queue = []; },
  };
}

export function squashQueues<P, T extends string>(
  queue1: IQueue<T>, queue2: IQueue<P>, accumulator: { [key: string]: P[] },
) {
  queue1.forEach((type: T) => (
    queue2.forEach((predicate: P) => {
      accumulator[type] = (accumulator[type] || []).concat(predicate);
    })
  ));

  queue2.flush();
  queue1.flush();
}
