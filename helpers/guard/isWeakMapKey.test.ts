/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { isWeakMapKey } from './isWeakMapKey';

describe('isWeakMapKey', () => {
  it('plain object → true', () => {
    expect(isWeakMapKey({})).toBe(true);
  });

  it('array → true', () => {
    expect(isWeakMapKey([])).toBe(true);
  });

  it('function → true', () => {
    expect(isWeakMapKey(() => {})).toBe(true);
  });

  it('unregistered symbol → true', () => {
    expect(isWeakMapKey(Symbol('x'))).toBe(true);
  });

  it('well-known symbol → true', () => {
    expect(isWeakMapKey(Symbol.iterator)).toBe(true);
  });

  it('registered symbol (Symbol.for) → false', () => {
    expect(isWeakMapKey(Symbol.for('helpers4-test-key'))).toBe(false);
  });

  it('null → false', () => {
    expect(isWeakMapKey(null)).toBe(false);
  });

  it('undefined → false', () => {
    expect(isWeakMapKey(undefined)).toBe(false);
  });

  it('number → false', () => {
    expect(isWeakMapKey(42)).toBe(false);
  });

  it('string → false', () => {
    expect(isWeakMapKey('x')).toBe(false);
  });

  it('boolean → false', () => {
    expect(isWeakMapKey(true)).toBe(false);
  });

  it('bigint → false', () => {
    expect(isWeakMapKey(10n)).toBe(false);
  });

  it('is actually usable as a WeakMap key when true', () => {
    const wm = new WeakMap();
    const key = {};
    expect(isWeakMapKey(key)).toBe(true);
    expect(() => wm.set(key, 'value')).not.toThrow();
  });

  it('a registered symbol actually throws when used as a WeakMap key, confirming the false result', () => {
    const wm = new WeakMap();
    const registered = Symbol.for('helpers4-test-key-2');
    expect(isWeakMapKey(registered)).toBe(false);
    expect(() => wm.set(registered as unknown as object, 'value')).toThrow();
  });
});
