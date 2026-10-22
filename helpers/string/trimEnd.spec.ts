/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { trimEnd } from './trimEnd';

describe('trimEnd — property-based', () => {
  it('"whitespace" mode always matches String.prototype.trimEnd', () => {
    fc.assert(
      fc.property(fc.string(), (input) => {
        expect(trimEnd(input)).toBe(input.trimEnd());
        expect(trimEnd(input, 'whitespace')).toBe(input.trimEnd());
      }),
    );
  });

  it('never produces a result longer than the input', () => {
    fc.assert(
      fc.property(
        fc.string({ unit: 'grapheme' }),
        fc.constantFrom('wrappable', 'separator', 'whitespace', 'unicode') as fc.Arbitrary<
          'wrappable' | 'separator' | 'whitespace' | 'unicode'
        >,
        (input, mode) => {
          expect(trimEnd(input, mode).length).toBeLessThanOrEqual(input.length);
        },
      ),
    );
  });

  it('modes are strictly nested: wrappable >= separator >= whitespace >= unicode (result length)', () => {
    fc.assert(
      fc.property(fc.string({ unit: 'grapheme' }), (input) => {
        const wrappable = trimEnd(input, 'wrappable').length;
        const separator = trimEnd(input, 'separator').length;
        const whitespace = trimEnd(input, 'whitespace').length;
        const unicode = trimEnd(input, 'unicode').length;
        expect(wrappable).toBeGreaterThanOrEqual(separator);
        expect(separator).toBeGreaterThanOrEqual(whitespace);
        expect(whitespace).toBeGreaterThanOrEqual(unicode);
      }),
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
          const once = trimEnd(input, mode);
          expect(trimEnd(once, mode)).toBe(once);
        },
      ),
    );
  });
});

describe('trimEnd — contract', () => {
  it('does not throw on any string input', () => {
    expect(() => trimEnd('\x00\x01\x02')).not.toThrow();
  });
});
