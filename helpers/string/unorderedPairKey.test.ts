/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { unorderedPairKey } from './unorderedPairKey';

describe('unorderedPairKey', () => {
  it('joins two strings with the default separator', () => {
    expect(unorderedPairKey('alice', 'bob')).toBe('alice|bob');
  });

  it('produces the same key regardless of argument order', () => {
    expect(unorderedPairKey('bob', 'alice')).toBe(unorderedPairKey('alice', 'bob'));
  });

  it('sorts lexicographically smaller string first', () => {
    expect(unorderedPairKey('zebra', 'apple')).toBe('apple|zebra');
  });

  it('handles equal strings', () => {
    expect(unorderedPairKey('same', 'same')).toBe('same|same');
  });

  it('supports a custom separator', () => {
    expect(unorderedPairKey('bob', 'alice', ':')).toBe('alice:bob');
  });

  it('handles empty strings', () => {
    expect(unorderedPairKey('', 'a')).toBe('|a');
  });
});
