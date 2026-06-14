/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { Observable, Subject } from 'rxjs';
import { describe, expect, it } from 'vitest';
import { isObservable } from './isObservable';

describe('isObservable — property-based', () => {
  it('primitives are never observables', () => {
    fc.assert(
      fc.property(fc.oneof(fc.string(), fc.integer(), fc.boolean()), (value) => {
        expect(isObservable(value)).toBe(false);
      }),
    );
  });
});

describe('isObservable — contract', () => {
  it('null → false', () => expect(isObservable(null)).toBe(false));
  it('undefined → false', () => expect(isObservable(undefined)).toBe(false));
  it('{} → false', () => expect(isObservable({})).toBe(false));
  it('Promise → false', () => expect(isObservable(Promise.resolve())).toBe(false));
  it('{ subscribe: fn } only → false (pipe missing)', () => expect(isObservable({ subscribe: () => {} })).toBe(false));
  it('{ pipe: fn } only → false (subscribe missing)', () => expect(isObservable({ pipe: () => {} })).toBe(false));
  it('Observable → true', () => expect(isObservable(new Observable())).toBe(true));
  it('Subject → true', () => expect(isObservable(new Subject())).toBe(true));
  it('non-fn subscribe → false', () => expect(isObservable({ subscribe: 'x', pipe: () => {} })).toBe(false));
  it('non-fn pipe → false', () => expect(isObservable({ subscribe: () => {}, pipe: 'x' })).toBe(false));
});
