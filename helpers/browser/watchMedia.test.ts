/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { afterEach, describe, expect, it, vi } from 'vitest';
import { watchMedia } from './watchMedia';

function fakeMediaList() {
  const target = new EventTarget();
  const list = Object.assign(target, { matches: false });
  const fire = (matches: boolean) => list.dispatchEvent(Object.assign(new Event('change'), { matches }));
  return { list, fire };
}

describe('watchMedia', () => {
  afterEach(() => { vi.unstubAllGlobals(); });

  it('calls the listener on each change until stopped', () => {
    const { list, fire } = fakeMediaList();
    vi.stubGlobal('matchMedia', vi.fn(() => list));
    const listener = vi.fn();
    const stop = watchMedia('(min-width: 600px)', listener);
    expect(listener).not.toHaveBeenCalled();
    fire(true);
    fire(false);
    expect(listener.mock.calls).toEqual([[true], [false]]);
    stop();
    fire(true);
    expect(listener).toHaveBeenCalledTimes(2);
  });

  it('does nothing outside a browser', () => {
    vi.stubGlobal('matchMedia', undefined);
    const listener = vi.fn();
    const stop = watchMedia('(min-width: 600px)', listener);
    expect(() => stop()).not.toThrow();
    expect(listener).not.toHaveBeenCalled();
  });
});
