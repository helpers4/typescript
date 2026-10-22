/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { whenIdle } from './whenIdle';

describe('whenIdle — property-based', () => {
  afterEach(() => { vi.unstubAllGlobals(); vi.useRealTimers(); });

  it('runs exactly the callbacks that were not cancelled', () => {
    vi.useFakeTimers();
    vi.stubGlobal('requestIdleCallback', undefined);
    fc.assert(fc.property(fc.array(fc.boolean(), { maxLength: 20 }), (cancelled) => {
      const ran: number[] = [];
      cancelled.forEach((cancel, i) => {
        const stop = whenIdle(() => ran.push(i));
        if (cancel) stop();
      });
      vi.runAllTimers();
      expect(ran).toEqual(cancelled.flatMap((cancel, i) => (cancel ? [] : [i])));
    }));
  });
});
