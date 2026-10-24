/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it, vi } from 'vitest';
import { abortable } from './_abortable';

describe('abortable', () => {
  it('returns the promise itself without a signal', () => {
    const promise = Promise.resolve(1);
    expect(abortable(promise, undefined)).toBe(promise);
  });

  it('settles like the promise while the signal is not aborted', async () => {
    const signal = new AbortController().signal;
    const remove = vi.spyOn(signal, 'removeEventListener');
    await expect(abortable(Promise.resolve(1), signal)).resolves.toBe(1);
    await expect(abortable(Promise.reject(new Error('fail')), signal)).rejects.toThrow('fail');
    expect(remove).toHaveBeenCalledTimes(2);
  });

  it('rejects with the reason of an already aborted signal', async () => {
    await expect(abortable(Promise.resolve(1), AbortSignal.abort('gone'))).rejects.toBe('gone');
  });

  it('rejects with the reason as soon as the signal aborts, without waiting', async () => {
    const controller = new AbortController();
    const promise = abortable(new Promise(() => {}), controller.signal);
    controller.abort('stop');
    await expect(promise).rejects.toBe('stop');
  });
});
