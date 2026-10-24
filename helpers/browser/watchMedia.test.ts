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

  it('stops watching when the signal aborts, and lets go of it when stopped', () => {
    const { list, fire } = fakeMediaList();
    vi.stubGlobal('matchMedia', vi.fn(() => list));
    const controller = new AbortController();
    const listener = vi.fn();
    watchMedia('(min-width: 600px)', listener, { signal: controller.signal });
    controller.abort();
    fire(true);
    expect(listener).not.toHaveBeenCalled();

    const other = new AbortController();
    const remove = vi.spyOn(other.signal, 'removeEventListener');
    watchMedia('(min-width: 600px)', listener, { signal: other.signal })();
    expect(remove).toHaveBeenCalledOnce();
  });

  it('watches nothing with an already aborted signal', () => {
    const matchMedia = vi.fn();
    vi.stubGlobal('matchMedia', matchMedia);
    const stop = watchMedia('(min-width: 600px)', vi.fn(), { signal: AbortSignal.abort() });
    expect(matchMedia).not.toHaveBeenCalled();
    expect(() => stop()).not.toThrow();
  });
});
