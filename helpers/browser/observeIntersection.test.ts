/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { afterEach, describe, expect, it, vi } from 'vitest';
import { observeIntersection } from './observeIntersection';

class FakeIntersectionObserver {
  static last: FakeIntersectionObserver;
  observed: Element[] = [];
  disconnected = false;
  constructor(public callback: (entries: IntersectionObserverEntry[]) => void, public options?: IntersectionObserverInit) {
    FakeIntersectionObserver.last = this;
  }
  observe(element: Element) { this.observed.push(element); }
  disconnect() { this.disconnected = true; }
}

describe('observeIntersection', () => {
  afterEach(() => { vi.unstubAllGlobals(); });

  it('observes the element with the options and forwards each entry until stopped', () => {
    vi.stubGlobal('IntersectionObserver', FakeIntersectionObserver);
    const element = document.createElement('div');
    const callback = vi.fn();
    const stop = observeIntersection(element, callback, { rootMargin: '200px' });
    const observer = FakeIntersectionObserver.last;
    expect(observer.observed).toEqual([element]);
    expect(observer.options).toEqual({ rootMargin: '200px' });
    const entry = { isIntersecting: true } as IntersectionObserverEntry;
    observer.callback([entry, entry]);
    expect(callback).toHaveBeenCalledTimes(2);
    stop();
    expect(observer.disconnected).toBe(true);
  });

  it('does nothing without IntersectionObserver', () => {
    vi.stubGlobal('IntersectionObserver', undefined);
    expect(() => observeIntersection(document.createElement('div'), vi.fn())()).not.toThrow();
  });
});
