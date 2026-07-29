/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { trim } from './trim';

describe('trim — property-based', () => {
  it('"whitespace" mode always matches String.prototype.trim', () => {
    fc.assert(
      fc.property(fc.string(), (input) => {
        expect(trim(input)).toBe(input.trim());
        expect(trim(input, 'whitespace')).toBe(input.trim());
      }),
    );
  });

  it('is equivalent to trimStart(trimEnd(input, mode), mode) for any mode', () => {
    fc.assert(
      fc.property(
        fc.string({ unit: 'grapheme' }),
        fc.constantFrom('wrappable', 'separator', 'whitespace', 'unicode') as fc.Arbitrary<
          'wrappable' | 'separator' | 'whitespace' | 'unicode'
        >,
        (input, mode) => {
          expect(trim(input, mode).length).toBeLessThanOrEqual(input.length);
        },
      ),
    );
  });

  it('trimming twice is the same as trimming once (idempotent)', () => {
    fc.assert(
      fc.property(
        fc.string({ unit: 'grapheme' }),
        fc.constantFrom('wrappable', 'separator', 'whitespace', 'unicode') as fc.Arbitrary<
          'wrappable' | 'separator' | 'whitespace' | 'unicode'
        >,
        (input, mode) => {
          const once = trim(input, mode);
          expect(trim(once, mode)).toBe(once);
        },
      ),
    );
  });
});

describe('trim — contract', () => {
  it('does not throw on any string input', () => {
    expect(() => trim('\x00\x01\x02')).not.toThrow();
  });
});
