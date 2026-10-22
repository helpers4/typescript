/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { camelCaseKeys } from './camelCaseKeys';

describe('camelCaseKeys', () => {
  it('converts snake_case keys to camelCase', () => {
    expect(camelCaseKeys({ user_name: 'Alice' })).toEqual({ userName: 'Alice' });
  });

  it('converts kebab-case keys to camelCase', () => {
    expect(camelCaseKeys({ 'user-name': 'Alice' })).toEqual({ userName: 'Alice' });
  });

  it('recurses into nested plain objects', () => {
    expect(camelCaseKeys({ home_address: { zip_code: '12345' } })).toEqual({
      homeAddress: { zipCode: '12345' },
    });
  });

  it('recurses into arrays of objects', () => {
    expect(camelCaseKeys({ user_list: [{ first_name: 'A' }, { first_name: 'B' }] })).toEqual({
      userList: [{ firstName: 'A' }, { firstName: 'B' }],
    });
  });

  it('leaves already-camelCase keys unchanged', () => {
    expect(camelCaseKeys({ userName: 'Alice' })).toEqual({ userName: 'Alice' });
  });

  it('does not descend into non-plain-object values', () => {
    const date = new Date('2026-01-01');
    expect(camelCaseKeys({ created_at: date })).toEqual({ createdAt: date });
  });

  it('handles an empty object', () => {
    expect(camelCaseKeys({})).toEqual({});
  });

  it('collapses a key with no word characters to an empty string (matches camelCase() directly)', () => {
    expect(camelCaseKeys({ '___': 'value' })).toEqual({ '': 'value' });
  });

  it('does not mutate the input', () => {
    const input = { user_name: 'Alice' };
    camelCaseKeys(input);
    expect(input).toEqual({ user_name: 'Alice' });
  });

  it('skips a dangerous key (constructor)', () => {
    expect(camelCaseKeys({ constructor: 'x', a: 1 })).toEqual({ a: 1 });
  });

  it('skips a dangerous key (prototype)', () => {
    expect(camelCaseKeys({ prototype: 'x', a: 1 })).toEqual({ a: 1 });
  });

  it('sanitizes a literal __proto__ key to "proto" rather than needing to skip it', () => {
    const obj = JSON.parse('{"__proto__": "x", "a": 1}') as Record<string, unknown>;
    expect(camelCaseKeys(obj)).toEqual({ proto: 'x', a: 1 });
  });
});
