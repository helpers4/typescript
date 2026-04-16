/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { isError } from './isError';

describe('isError — property-based', () => {
  it('Error instances always have a .message property', () => {
    fc.assert(
      fc.property(fc.string(), (msg) => {
        const err = new Error(msg);
        expect(isError(err)).toBe(true);
        expect(typeof err.message).toBe('string');
      }),
    );
  });

  it('primitives are never errors', () => {
    fc.assert(
      fc.property(
        fc.oneof(fc.integer(), fc.string(), fc.boolean(), fc.constant(null), fc.constant(undefined)),
        (v) => {
          expect(isError(v)).toBe(false);
        },
      ),
    );
  });
});

describe('isError — contract', () => {
  it('new Error() → true', () => expect(isError(new Error())).toBe(true));
  it("new TypeError('x') → true", () => expect(isError(new TypeError('x'))).toBe(true));
  it('new RangeError() → true', () => expect(isError(new RangeError())).toBe(true));
  it('new SyntaxError() → true', () => expect(isError(new SyntaxError())).toBe(true));
  it("{message:'x'} → false", () => expect(isError({ message: 'x' })).toBe(false));
  it("'error' → false", () => expect(isError('error')).toBe(false));
  it('null → false', () => expect(isError(null)).toBe(false));
  it('undefined → false', () => expect(isError(undefined)).toBe(false));
});
