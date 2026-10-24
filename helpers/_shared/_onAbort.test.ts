/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it, vi } from 'vitest';
import { onAbort } from './_onAbort';

describe('onAbort', () => {
  it('does nothing without a signal', () => {
    const abort = vi.fn();
    onAbort(undefined, abort)();
    expect(abort).not.toHaveBeenCalled();
  });

  it('calls abort at once with the reason of an already aborted signal', () => {
    const abort = vi.fn();
    const remove = onAbort(AbortSignal.abort('gone'), abort);
    expect(abort).toHaveBeenCalledExactlyOnceWith('gone');
    remove();
  });

  it('calls abort with the reason once the signal aborts', () => {
    const controller = new AbortController();
    const abort = vi.fn();
    onAbort(controller.signal, abort);
    expect(abort).not.toHaveBeenCalled();
    controller.abort('stop');
    expect(abort).toHaveBeenCalledExactlyOnceWith('stop');
  });

  it('removes the listener', () => {
    const controller = new AbortController();
    const abort = vi.fn();
    onAbort(controller.signal, abort)();
    controller.abort();
    expect(abort).not.toHaveBeenCalled();
  });
});
