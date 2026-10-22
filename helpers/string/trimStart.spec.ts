/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { trimStart } from './trimStart';

describe('trimStart — property-based', () => {
  it('"whitespace" mode always matches String.prototype.trimStart', () => {
    fc.assert(
      fc.property(fc.string(), (input) => {
        expect(trimStart(input)).toBe(input.trimStart());
        expect(trimStart(input, 'whitespace')).toBe(input.trimStart());
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
          expect(trimStart(input, mode).length).toBeLessThanOrEqual(input.length);
        },
      ),
    );
  });

  it('modes are strictly nested: wrappable >= separator >= whitespace >= unicode (result length)', () => {
    fc.assert(
      fc.property(fc.string({ unit: 'grapheme' }), (input) => {
        const wrappable = trimStart(input, 'wrappable').length;
        const separator = trimStart(input, 'separator').length;
        const whitespace = trimStart(input, 'whitespace').length;
        const unicode = trimStart(input, 'unicode').length;
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
          const once = trimStart(input, mode);
          expect(trimStart(once, mode)).toBe(once);
        },
      ),
    );
  });
});

describe('trimStart — contract', () => {
  it('does not throw on any string input', () => {
    expect(() => trimStart('\x00\x01\x02')).not.toThrow();
  });
});
