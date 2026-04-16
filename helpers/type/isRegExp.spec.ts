/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { isRegExp } from './isRegExp';

describe('isRegExp — property-based', () => {
  it('RegExp instances have a .test() method', () => {
    fc.assert(
      fc.property(fc.string(), (pattern) => {
        try {
          const re = new RegExp(pattern);
          expect(isRegExp(re)).toBe(true);
          expect(typeof re.test).toBe('function');
        } catch {
          // invalid regex patterns are skipped
        }
      }),
    );
  });

  it('primitives are never regexes', () => {
    fc.assert(
      fc.property(
        fc.oneof(fc.integer(), fc.string(), fc.boolean(), fc.constant(null), fc.constant(undefined)),
        (v) => {
          expect(isRegExp(v)).toBe(false);
        },
      ),
    );
  });
});

describe('isRegExp — contract', () => {
  it('/regex/ → true', () => expect(isRegExp(/regex/)).toBe(true));
  it("new RegExp('foo') → true", () => expect(isRegExp(new RegExp('foo'))).toBe(true));
  it('/^\\d+$/gi → true', () => expect(isRegExp(/^\d+$/gi)).toBe(true));
  it("'foo' → false", () => expect(isRegExp('foo')).toBe(false));
  it('{} → false', () => expect(isRegExp({})).toBe(false));
  it('null → false', () => expect(isRegExp(null)).toBe(false));
  it('undefined → false', () => expect(isRegExp(undefined)).toBe(false));
});
