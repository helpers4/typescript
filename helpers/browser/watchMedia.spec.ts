/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { watchMedia } from './watchMedia';

describe('watchMedia — property-based', () => {
  afterEach(() => { vi.unstubAllGlobals(); });

  it('forwards every change, in order', () => {
    fc.assert(fc.property(fc.array(fc.boolean()), (changes) => {
      const list = Object.assign(new EventTarget(), { matches: false });
      vi.stubGlobal('matchMedia', () => list);
      const seen: boolean[] = [];
      const stop = watchMedia('screen', (matches) => seen.push(matches));
      for (const matches of changes) list.dispatchEvent(Object.assign(new Event('change'), { matches }));
      stop();
      expect(seen).toEqual(changes);
    }));
  });
});
