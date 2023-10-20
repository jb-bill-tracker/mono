import { writable, readable, type Readable, type Writable } from 'svelte/store';

export function makeAsyncWritableStore<R, T extends (...args: any[]) => Promise<any> = (...args: any[]) => Promise<R>>(fn: T, placeholder: R): Writable<R> {
  
  const store = writable<R>(placeholder);
  fn().then(r => store.set(r));
  return store;
}

export function makeAsyncReadbaleStore<R, T extends (...args: any[]) => Promise<any> = (...args: any[]) => Promise<R>>(fn: T, placeholder: R): Readable<R> {
  const store = readable<R>(placeholder, set => {
    fn().then(r => set(r));
  });
  return store;
}