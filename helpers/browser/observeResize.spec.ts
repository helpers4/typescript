/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { observeResize } from './observeResize';

describe('observeResize — property-based', () => {
  afterEach(() => { vi.unstubAllGlobals(); });

  it('calls back once per entry, in order', () => {
    fc.assert(fc.property(fc.array(fc.array(fc.nat(), { maxLength: 4 }), { maxLength: 5 }), (batches) => {
      let notify: (entries: ResizeObserverEntry[]) => void = () => {};
      vi.stubGlobal('ResizeObserver', class {
        constructor(callback: (entries: ResizeObserverEntry[]) => void) { notify = callback; }
        observe() {}
        disconnect() {}
      });
      const seen: unknown[] = [];
      observeResize(document.createElement('div'), (entry) => seen.push(entry));
      for (const batch of batches) notify(batch as unknown as ResizeObserverEntry[]);
      expect(seen).toEqual(batches.flat());
    }));
  });
});
