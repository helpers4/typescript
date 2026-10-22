/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { afterEach, describe, expect, it, vi } from 'vitest';
import { observeResize } from './observeResize';

class FakeResizeObserver {
  static last: FakeResizeObserver;
  observed: Element[] = [];
  disconnected = false;
  constructor(public callback: (entries: ResizeObserverEntry[]) => void) {
    FakeResizeObserver.last = this;
  }
  observe(element: Element) { this.observed.push(element); }
  disconnect() { this.disconnected = true; }
}

describe('observeResize', () => {
  afterEach(() => { vi.unstubAllGlobals(); });

  it('observes the element and forwards each entry until stopped', () => {
    vi.stubGlobal('ResizeObserver', FakeResizeObserver);
    const element = document.createElement('div');
    const callback = vi.fn();
    const stop = observeResize(element, callback);
    const observer = FakeResizeObserver.last;
    expect(observer.observed).toEqual([element]);
    const entry = { target: element } as unknown as ResizeObserverEntry;
    observer.callback([entry, entry]);
    expect(callback).toHaveBeenCalledTimes(2);
    expect(callback).toHaveBeenCalledWith(entry);
    stop();
    expect(observer.disconnected).toBe(true);
  });

  it('does nothing without ResizeObserver', () => {
    vi.stubGlobal('ResizeObserver', undefined);
    const stop = observeResize(document.createElement('div'), vi.fn());
    expect(() => stop()).not.toThrow();
  });
});
