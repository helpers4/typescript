/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { stripV } from './stripV';

describe('stripV — property-based', () => {
  it('strips exactly one leading lowercase "v"', () => {
    fc.assert(
      fc.property(fc.string(), (s: string) => {
        const result = stripV(s);
        if (typeof result === 'string') {
          if (s.startsWith('v')) {
            expect(result).toBe(s.slice(1));
          } else {
            expect(result).toBe(s);
          }
        }
      }),
    );
  });

  it('idempotent for strings not starting with "vv"', () => {
    fc.assert(
      fc.property(
        fc.string().filter(s => !s.startsWith('vv')),
        (s: string) => {
          const once = stripV(s);
          const twice = stripV(once);
          expect(twice).toBe(once);
        },
      ),
    );
  });
  it('if input does not start with v/V, result === input', () => {
    fc.assert(
      fc.property(
        fc.string().filter(s => !s.startsWith('v') && !s.startsWith('V')),
        (s: string) => {
          expect(stripV(s)).toBe(s);
        },
      ),
    );
  });
});

describe('stripV — contract', () => {
  it('"v1.0.0" → "1.0.0"', () => {
    expect(stripV('v1.0.0')).toBe('1.0.0');
  });

  it('"V1.0.0" → "V1.0.0" (uppercase V is not stripped)', () => {
    expect(stripV('V1.0.0')).toBe('V1.0.0');
  });

  it('"1.0.0" → "1.0.0" (no change)', () => {
    expect(stripV('1.0.0')).toBe('1.0.0');
  });

  it('"" → ""', () => {
    expect(stripV('')).toBe('');
  });

  it('null → null', () => {
    expect(stripV(null)).toBeNull();
  });

  it('undefined → undefined', () => {
    expect(stripV(undefined)).toBeUndefined();
  });

  it('"v" alone → ""', () => {
    expect(stripV('v')).toBe('');
  });
});
