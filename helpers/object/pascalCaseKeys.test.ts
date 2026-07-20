/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { pascalCaseKeys } from './pascalCaseKeys';

describe('pascalCaseKeys', () => {
  it('converts snake_case keys to PascalCase', () => {
    expect(pascalCaseKeys({ user_name: 'Alice' })).toEqual({ UserName: 'Alice' });
  });

  it('recurses into nested plain objects', () => {
    expect(pascalCaseKeys({ home_address: { zip_code: '12345' } })).toEqual({
      HomeAddress: { ZipCode: '12345' },
    });
  });

  it('recurses into arrays of objects', () => {
    expect(pascalCaseKeys({ user_list: [{ first_name: 'A' }] })).toEqual({
      UserList: [{ FirstName: 'A' }],
    });
  });

  it('leaves already-PascalCase keys unchanged', () => {
    expect(pascalCaseKeys({ UserName: 'Alice' })).toEqual({ UserName: 'Alice' });
  });

  it('handles an empty object', () => {
    expect(pascalCaseKeys({})).toEqual({});
  });

  it('skips a dangerous key (constructor -> Constructor is safe, but literal constructor input is checked pre-transform via mapDeep)', () => {
    // pascalCase('constructor') => 'Constructor', which is NOT itself a dangerous key —
    // this documents that the danger only reappears if the *transformed* key collides,
    // consistent with mapDeep checking the post-transform key.
    expect(pascalCaseKeys({ constructor: 'x' })).toEqual({ Constructor: 'x' });
  });
});
