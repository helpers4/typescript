/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { loadFont } from './loadFont';

describe('loadFont — property-based', () => {
  afterEach(() => { vi.unstubAllGlobals(); });

  it('wraps any URL in a url() that CSS reads back unchanged', async () => {
    Object.defineProperty(document, 'fonts', { value: { add: () => {} }, configurable: true });
    await fc.assert(fc.asyncProperty(fc.string(), async (url) => {
      let source: unknown;
      vi.stubGlobal('FontFace', class {
        constructor(_family: string, given: unknown) { source = given; }
        load() { return Promise.resolve(this); }
      });
      await loadFont('F', url);
      expect(JSON.parse((source as string).slice(4, -1))).toBe(url);
    }));
  });
});
