/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { countBy } from './countBy';

describe('countBy', () => {
  it('counts values per derived group', () => {
    expect(countBy(new Set([1, 2, 3, 4]), (v) => (v % 2 === 0 ? 'even' : 'odd'))).toEqual(
      new Map([['odd', 2], ['even', 2]]),
    );
  });

  it('returns an empty map for an empty input', () => {
    expect(countBy(new Set<number>(), (v) => v)).toEqual(new Map());
  });
});
