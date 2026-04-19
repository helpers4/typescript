/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { noop } from './noop';

describe('noop — contract', () => {
  it('always returns undefined regardless of how many times called', () => {
    for (let i = 0; i < 100; i++) {
      expect(noop()).toBeUndefined();
    }
  });

  it('has no side effects when used as a callback', () => {
    const results: void[] = [];
    for (let i = 0; i < 10; i++) {
      results.push(noop());
    }
    expect(results).toEqual(Array.from({ length: 10 }, () => undefined));
  });
});
