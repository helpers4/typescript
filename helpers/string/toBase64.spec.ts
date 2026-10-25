/**
 * This file is part of helpers4.
 * Copyright (C) 2026 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { toBase64 } from './toBase64';

describe('toBase64 — property-based', () => {
  it('agrees with Node Buffer for any bytes', () => {
    fc.assert(
      fc.property(fc.uint8Array(), (bytes) => {
        expect(toBase64(bytes)).toBe(Buffer.from(bytes).toString('base64'));
        expect(toBase64(bytes, { urlSafe: true })).toBe(Buffer.from(bytes).toString('base64url'));
      }),
    );
  });

  it('agrees with Node Buffer for any string', () => {
    fc.assert(
      fc.property(fc.string({ unit: 'binary' }), (s) => {
        expect(toBase64(s)).toBe(Buffer.from(s, 'utf8').toString('base64'));
      }),
    );
  });
});
