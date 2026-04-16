/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { isPromise } from './isPromise';

describe('isPromise — property-based', () => {
  it('isPromise(v) → v has .then and .catch as functions', () => {
    const p = Promise.resolve(1);
    expect(isPromise(p)).toBe(true);
    expect(typeof p.then).toBe('function');
    expect(typeof p.catch).toBe('function');
  });

  it('primitives are never promises', () => {
    fc.assert(
      fc.property(
        fc.oneof(fc.integer(), fc.string(), fc.boolean(), fc.constant(null), fc.constant(undefined)),
        (v) => {
          expect(isPromise(v)).toBe(false);
        },
      ),
    );
  });
});

describe('isPromise — contract', () => {
  it('Promise.resolve(1) → true', () => expect(isPromise(Promise.resolve(1))).toBe(true));
  it('new Promise(r=>r(1)) → true', () => expect(isPromise(new Promise((r) => r(1)))).toBe(true));
  it('{then:()=>{}} → false (no catch)', () => expect(isPromise({ then: () => {} })).toBe(false));
  it('{then:()=>{},catch:()=>{}} → true (thenable with catch)', () => {
    expect(isPromise({ then: () => {}, catch: () => {} })).toBe(true);
  });
  it('null → false', () => expect(isPromise(null)).toBe(false));
  it('42 → false', () => expect(isPromise(42)).toBe(false));
  it('{} → false', () => expect(isPromise({})).toBe(false));
});
