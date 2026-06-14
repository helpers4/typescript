/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { isSharedArrayBuffer } from './isSharedArrayBuffer';

describe('isSharedArrayBuffer — property-based', () => {
  it('primitives are never SharedArrayBuffers', () => {
    fc.assert(
      fc.property(fc.oneof(fc.string(), fc.integer(), fc.boolean()), (value) => {
        expect(isSharedArrayBuffer(value)).toBe(false);
      }),
    );
  });
});

describe('isSharedArrayBuffer — contract', () => {
  it('null → false', () => expect(isSharedArrayBuffer(null)).toBe(false));
  it('undefined → false', () => expect(isSharedArrayBuffer(undefined)).toBe(false));
  it('ArrayBuffer → false', () => expect(isSharedArrayBuffer(new ArrayBuffer(8))).toBe(false));
  it('Uint8Array → false', () => expect(isSharedArrayBuffer(new Uint8Array(8))).toBe(false));
  it('{} → false', () => expect(isSharedArrayBuffer({})).toBe(false));
  it('SharedArrayBuffer(0) → true', () => expect(isSharedArrayBuffer(new SharedArrayBuffer(0))).toBe(true));
  it('SharedArrayBuffer(16) → true', () => expect(isSharedArrayBuffer(new SharedArrayBuffer(16))).toBe(true));
});
