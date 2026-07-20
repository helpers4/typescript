/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { isBrowser } from './isBrowser';

describe('isBrowser — property-based', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('matches whether window.document is present, for any window-shaped stub', () => {
    fc.assert(
      fc.property(fc.boolean(), (hasDocument) => {
        vi.stubGlobal('window', hasDocument ? { document: {} } : {});
        expect(isBrowser()).toBe(hasDocument);
        vi.unstubAllGlobals();
      }),
    );
  });
});

describe('isBrowser — contract', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('is false when window itself is missing', () => {
    vi.stubGlobal('window', undefined);
    expect(isBrowser()).toBe(false);
  });
});
