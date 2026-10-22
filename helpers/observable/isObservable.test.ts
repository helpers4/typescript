/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { BehaviorSubject, Observable, ReplaySubject, Subject } from 'rxjs';
import { describe, expect, it } from 'vitest';
import { isObservable } from './isObservable';

describe('isObservable', () => {
  it('should return true for Observable instances', () => {
    expect(isObservable(new Observable())).toBe(true);
    expect(isObservable(new Observable((obs) => { obs.next(1); }))).toBe(true);
  });

  it('should return true for Subject variants', () => {
    expect(isObservable(new Subject())).toBe(true);
    expect(isObservable(new BehaviorSubject(0))).toBe(true);
    expect(isObservable(new ReplaySubject(1))).toBe(true);
  });

  it('should return true for objects with subscribe and pipe functions', () => {
    expect(isObservable({ subscribe: () => {}, pipe: () => {} })).toBe(true);
  });

  it('should return false when subscribe is missing', () => {
    expect(isObservable({ pipe: () => {} })).toBe(false);
  });

  it('should return false when pipe is missing', () => {
    expect(isObservable({ subscribe: () => {} })).toBe(false);
  });

  it('should return false when methods are not functions', () => {
    expect(isObservable({ subscribe: 'x', pipe: () => {} })).toBe(false);
    expect(isObservable({ subscribe: () => {}, pipe: 'x' })).toBe(false);
  });

  it('should return false for Promises', () => {
    expect(isObservable(Promise.resolve())).toBe(false);
  });

  it('should return false for null and undefined', () => {
    expect(isObservable(null)).toBe(false);
    expect(isObservable(undefined)).toBe(false);
  });

  it('should return false for primitives and plain objects', () => {
    expect(isObservable(42)).toBe(false);
    expect(isObservable('observable')).toBe(false);
    expect(isObservable({})).toBe(false);
  });
});
