/**
 * This file is part of helpers4.
 * Copyright (C) 2026 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { fromBase64 } from './fromBase64';
import { toBase64 } from './toBase64';

describe('fromBase64 — property-based', () => {
  it('round-trips any bytes, in every flavour', () => {
    fc.assert(
      fc.property(fc.uint8Array(), fc.boolean(), fc.boolean(), (bytes, urlSafe, padding) => {
        expect(fromBase64(toBase64(bytes, { urlSafe, padding }), { output: 'bytes' })).toEqual(bytes);
      }),
    );
  });

  it('round-trips any string', () => {
    fc.assert(
      fc.property(fc.string({ unit: 'binary' }), (s) => {
        expect(fromBase64(toBase64(s))).toBe(s.toWellFormed());
      }),
    );
  });

  it('never throws anything but a SyntaxError or a TypeError', () => {
    fc.assert(
      fc.property(fc.string(), (s) => {
        try {
          fromBase64(s);
        } catch (error) {
          expect(error instanceof SyntaxError || error instanceof TypeError).toBe(true);
        }
      }),
    );
  });
});
