/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { isBlob } from './isBlob';

describe('isBlob — property-based', () => {
  it('Blob instances always return true', () => {
    fc.assert(
      fc.property(fc.string(), (content) => {
        expect(isBlob(new Blob([content]))).toBe(true);
      }),
    );
  });

  it('primitives never return true', () => {
    fc.assert(
      fc.property(fc.oneof(fc.string(), fc.integer(), fc.boolean()), (primitive) => {
        expect(isBlob(primitive)).toBe(false);
      }),
    );
  });
});

describe('isBlob — contract', () => {
  it('new Blob() → true', () => expect(isBlob(new Blob())).toBe(true));
  it("new Blob(['hello']) → true", () => expect(isBlob(new Blob(['hello']))).toBe(true));
  it('new ArrayBuffer(8) → false', () => expect(isBlob(new ArrayBuffer(8))).toBe(false));
  it('null → false', () => expect(isBlob(null)).toBe(false));
  it('undefined → false', () => expect(isBlob(undefined)).toBe(false));
  it('{} → false', () => expect(isBlob({})).toBe(false));
  it('"text" → false', () => expect(isBlob('text')).toBe(false));
});
