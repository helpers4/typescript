/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, expectTypeOf, it } from 'vitest';
import { isFormData } from './isFormData';

describe('isFormData — property-based', () => {
  it('primitives never return true', () => {
    fc.assert(
      fc.property(fc.oneof(fc.string(), fc.integer(), fc.boolean()), (primitive) => {
        expect(isFormData(primitive)).toBe(false);
      }),
    );
  });
});

describe('isFormData — contract', () => {
  it('new FormData() → true', () => expect(isFormData(new FormData())).toBe(true));
  it('FormData with entries → true', () => {
    const fd = new FormData();
    fd.append('k', 'v');
    expect(isFormData(fd)).toBe(true);
  });
  it('null → false', () => expect(isFormData(null)).toBe(false));
  it('undefined → false', () => expect(isFormData(undefined)).toBe(false));
  it('{} → false', () => expect(isFormData({})).toBe(false));
  it('new URLSearchParams() → false', () => expect(isFormData(new URLSearchParams())).toBe(false));
  it('new Blob() → false', () => expect(isFormData(new Blob())).toBe(false));
});

describe('isFormData — narrowing in if/else', () => {
  it('narrows the value to FormData in the then-branch', () => {
    const v: unknown = new FormData();
    if (isFormData(v)) {
      expectTypeOf(v).toEqualTypeOf<FormData>();
      expect(v.get('x')).toBeNull();
    } else {
      throw new Error('expected then-branch');
    }
    expect(isFormData({})).toBe(false);
  });
});
