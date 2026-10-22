/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { identity } from './identity';

describe('identity', () => {
  it('is the identity matrix', () => {
    expect(identity()).toEqual({ a: 1, b: 0, c: 0, d: 1, e: 0, f: 0 });
  });

  it('returns a new object each time', () => {
    expect(identity()).not.toBe(identity());
  });
});
