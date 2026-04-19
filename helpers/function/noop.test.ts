/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { noop } from './noop';

describe('noop', () => {
  it('should return undefined', () => {
    expect(noop()).toBeUndefined();
  });

  it('should be callable as a function', () => {
    expect(() => noop()).not.toThrow();
  });

  it('should be usable as a callback', () => {
    const fn: () => void = noop;
    expect(fn()).toBeUndefined();
  });
});
