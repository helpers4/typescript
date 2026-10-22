/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { translate } from './translate';

describe('translate', () => {
  it('puts the offset in e and f', () => {
    expect(translate(10, -5)).toEqual({ a: 1, b: 0, c: 0, d: 1, e: 10, f: -5 });
  });
});
