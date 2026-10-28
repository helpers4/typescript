/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it, vi } from 'vitest';
import { createBackStack } from './createBackStack';

describe('createBackStack', () => {
  it('starts on the initial entry, with nowhere to go back to', () => {
    const stack = createBackStack('a');
    expect(stack.current).toBe('a');
    expect(stack.canGoBack).toBe(false);
  });

  it('back returns the entry it left and restores the previous one', () => {
    const stack = createBackStack('a');
    stack.push('b');
    stack.push('c');
    expect(stack.back()).toBe('c');
    expect(stack.current).toBe('b');
    expect(stack.back()).toBe('b');
    expect(stack.current).toBe('a');
    expect(stack.canGoBack).toBe(false);
  });

  it('returns undefined and changes nothing without a previous entry', () => {
    const stack = createBackStack('a');
    expect(stack.back()).toBeUndefined();
    expect(stack.current).toBe('a');
  });

  it('drops the oldest entries past the limit', () => {
    const stack = createBackStack(0, { limit: 2 });
    stack.push(1);
    stack.push(2);
    stack.push(3);
    expect(stack.back()).toBe(3);
    expect(stack.back()).toBe(2);
    expect(stack.back()).toBeUndefined();
    expect(stack.current).toBe(1);
  });

  it('keeps no past with a limit of 0', () => {
    const stack = createBackStack(0, { limit: 0 });
    stack.push(1);
    expect(stack.canGoBack).toBe(false);
  });

  it('previous is the entry back would return to', () => {
    const stack = createBackStack('a');
    expect(stack.previous).toBeUndefined();
    stack.push('b');
    expect(stack.previous).toBe('a');
    stack.push('c');
    expect(stack.previous).toBe('b');
    stack.back();
    expect(stack.previous).toBe('a');
  });

  it('replace changes the current entry and keeps the ones underneath', () => {
    const stack = createBackStack('a');
    stack.push('b');
    stack.replace('c');
    expect(stack.current).toBe('c');
    expect(stack.previous).toBe('a');
    expect(stack.back()).toBe('c');
    expect(stack.current).toBe('a');
  });

  it('replace on a single entry leaves nothing to go back to', () => {
    const stack = createBackStack('a');
    stack.replace('b');
    expect(stack.current).toBe('b');
    expect(stack.canGoBack).toBe(false);
  });

  it('reset clears the stack, to the initial entry by default', () => {
    const stack = createBackStack('a');
    stack.push('b');
    stack.reset();
    expect(stack.current).toBe('a');
    expect(stack.canGoBack).toBe(false);
    stack.reset('z');
    expect(stack.current).toBe('z');
  });

  it('notifies listeners of each change until they unsubscribe', () => {
    const stack = createBackStack('a');
    const listener = vi.fn();
    const unsubscribe = stack.subscribe(listener);
    stack.push('b');
    stack.back();
    stack.back(); // nothing to go back to: no notification
    stack.replace('r');
    stack.reset('z');
    expect(listener.mock.calls).toEqual([['b'], ['a'], ['r'], ['z']]);
    unsubscribe();
    stack.push('c');
    expect(listener).toHaveBeenCalledTimes(4);
  });

  it('a listener can unsubscribe while being notified', () => {
    const stack = createBackStack('a');
    const second = vi.fn();
    const unsubscribe = stack.subscribe(() => unsubscribe());
    stack.subscribe(second);
    stack.push('b');
    expect(second).toHaveBeenCalledWith('b');
  });
});
