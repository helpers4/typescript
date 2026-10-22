/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { observeIntersection } from './observeIntersection';

describe('observeIntersection — property-based', () => {
  afterEach(() => { vi.unstubAllGlobals(); });

  it('calls back once per entry, in order', () => {
    fc.assert(fc.property(fc.array(fc.array(fc.boolean(), { maxLength: 4 }), { maxLength: 5 }), (batches) => {
      let notify: (entries: IntersectionObserverEntry[]) => void = () => {};
      vi.stubGlobal('IntersectionObserver', class {
        constructor(callback: (entries: IntersectionObserverEntry[]) => void) { notify = callback; }
        observe() {}
        disconnect() {}
      });
      const seen: boolean[] = [];
      observeIntersection({} as Element, (entry) => seen.push(entry.isIntersecting));
      for (const batch of batches) notify(batch.map((isIntersecting) => ({ isIntersecting }) as IntersectionObserverEntry));
      expect(seen).toEqual(batches.flat());
    }));
  });
});
