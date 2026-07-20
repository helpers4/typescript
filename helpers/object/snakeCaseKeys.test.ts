/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { snakeCaseKeys } from './snakeCaseKeys';

describe('snakeCaseKeys', () => {
  it('converts camelCase keys to snake_case', () => {
    expect(snakeCaseKeys({ userName: 'Alice' })).toEqual({ user_name: 'Alice' });
  });

  it('recurses into nested plain objects', () => {
    expect(snakeCaseKeys({ homeAddress: { zipCode: '12345' } })).toEqual({
      home_address: { zip_code: '12345' },
    });
  });

  it('recurses into arrays of objects', () => {
    expect(snakeCaseKeys({ userList: [{ firstName: 'A' }] })).toEqual({
      user_list: [{ first_name: 'A' }],
    });
  });

  it('leaves already-snake_case keys unchanged', () => {
    expect(snakeCaseKeys({ user_name: 'Alice' })).toEqual({ user_name: 'Alice' });
  });

  it('does not descend into non-plain-object values', () => {
    const date = new Date('2026-01-01');
    expect(snakeCaseKeys({ createdAt: date })).toEqual({ created_at: date });
  });

  it('handles an empty object', () => {
    expect(snakeCaseKeys({})).toEqual({});
  });

  it('skips a dangerous key (__proto__, via JSON.parse)', () => {
    const obj = JSON.parse('{"__proto__": "x", "a": 1}') as Record<string, unknown>;
    expect(snakeCaseKeys(obj)).toEqual({ a: 1 });
  });

  it('skips a dangerous key (constructor)', () => {
    expect(snakeCaseKeys({ constructor: 'x', a: 1 })).toEqual({ a: 1 });
  });

  it('skips a dangerous key (prototype)', () => {
    expect(snakeCaseKeys({ prototype: 'x', a: 1 })).toEqual({ a: 1 });
  });
});
