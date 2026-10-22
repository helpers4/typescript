/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * Options for {@link createBackStack}.
 * @since next
 */
export interface BackStackOptions {
  /**
   * Maximum number of past entries kept for {@link BackStack.back}. The oldest ones are dropped
   * first. Defaults to no limit; `0` keeps no past at all.
   */
  limit?: number;
}

/**
 * A back stack created by {@link createBackStack}.
 * @since next
 */
export interface BackStack<T> {
  /** The current entry. */
  readonly current: T;
  /** Whether {@link back} has a previous entry to return to. */
  readonly canGoBack: boolean;
  /** Makes `value` the current entry; the previous one is kept for {@link back}. */
  push(value: T): void;
  /**
   * Leaves the current entry for the previous one.
   * @returns The entry that was left, or `undefined` (and nothing changes) when there is no previous entry
   */
  back(): T | undefined;
  /** Clears the stack, with `value` (the initial entry by default) as the only entry. */
  reset(value?: T): void;
  /**
   * Calls `listener` with the new current entry after each change (`push`, a successful `back`,
   * `reset`).
   * @returns A function that removes the listener
   */
  subscribe(listener: (current: T) => void): () => void;
}

/**
 * Creates a back stack: a stack that always has a current entry (the one on top), with the
 * previous ones underneath to go `back` to. The bottom entry is never removed, so there is always
 * something to show: screens of a prototype, overlays stacked over a screen (with `null` as the
 * initial entry), wizard steps, undo levels.
 *
 * It does not decide what the next entry is: compute it (with a state machine, a router, ...)
 * and `push` it.
 *
 * @param initial - The first current entry, also the default of {@link BackStack.reset}
 * @param options - Depth limit — see {@link BackStackOptions}
 * @returns A {@link BackStack}
 * @example
 * const screens = createBackStack('home');
 * screens.push('settings');
 * screens.back();  // => 'settings' (the entry left)
 * screens.current; // => 'home'
 * @since next
 */
export function createBackStack<T>(initial: T, options: BackStackOptions = {}): BackStack<T> {
  const { limit = Infinity } = options;
  let past: T[] = [];
  let current = initial;
  const listeners = new Set<(current: T) => void>();

  function change(value: T): void {
    current = value;
    for (const listener of listeners) listener(current);
  }

  return {
    get current() {
      return current;
    },
    get canGoBack() {
      return past.length > 0;
    },
    push(value) {
      past.push(current);
      if (past.length > limit) past.splice(0, past.length - limit);
      change(value);
    },
    back() {
      if (past.length === 0) return undefined;
      const left = current;
      change(past.pop()!);
      return left;
    },
    reset(value = initial) {
      past = [];
      change(value);
    },
    subscribe(listener) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
  };
}
