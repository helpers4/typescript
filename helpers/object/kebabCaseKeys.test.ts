/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { kebabCaseKeys } from './kebabCaseKeys';

describe('kebabCaseKeys', () => {
  it('converts camelCase keys to kebab-case', () => {
    expect(kebabCaseKeys({ userName: 'Alice' })).toEqual({ 'user-name': 'Alice' });
  });

  it('converts snake_case keys to kebab-case', () => {
    expect(kebabCaseKeys({ user_name: 'Alice' })).toEqual({ 'user-name': 'Alice' });
  });

  it('recurses into nested plain objects', () => {
    expect(kebabCaseKeys({ homeAddress: { zipCode: '12345' } })).toEqual({
      'home-address': { 'zip-code': '12345' },
    });
  });

  it('recurses into arrays of objects', () => {
    expect(kebabCaseKeys({ userList: [{ firstName: 'A' }] })).toEqual({
      'user-list': [{ 'first-name': 'A' }],
    });
  });

  it('leaves already-kebab-case keys unchanged', () => {
    expect(kebabCaseKeys({ 'user-name': 'Alice' })).toEqual({ 'user-name': 'Alice' });
  });

  it('handles an empty object', () => {
    expect(kebabCaseKeys({})).toEqual({});
  });

  it('skips a dangerous key (constructor)', () => {
    expect(kebabCaseKeys({ constructor: 'x', a: 1 })).toEqual({ a: 1 });
  });
});
