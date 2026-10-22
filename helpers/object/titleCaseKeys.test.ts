/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { titleCaseKeys } from './titleCaseKeys';

describe('titleCaseKeys', () => {
  it('converts snake_case keys to Title Case', () => {
    expect(titleCaseKeys({ user_name: 'Alice' })).toEqual({ 'User Name': 'Alice' });
  });

  it('recurses into nested plain objects', () => {
    expect(titleCaseKeys({ home_address: { zip_code: '12345' } })).toEqual({
      'Home Address': { 'Zip Code': '12345' },
    });
  });

  it('recurses into arrays of objects', () => {
    expect(titleCaseKeys({ user_list: [{ first_name: 'A' }] })).toEqual({
      'User List': [{ 'First Name': 'A' }],
    });
  });

  it('handles an empty object', () => {
    expect(titleCaseKeys({})).toEqual({});
  });
});
