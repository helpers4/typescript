/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { stringifySequence } from './stringifySequence';

describe('stringifySequence', () => {
  it('frames each value as RS, compact JSON text, line feed', () => {
    expect(stringifySequence([{ id: 1 }, 2])).toBe('\u001E{"id":1}\n\u001E2\n');
  });

  it('writes an empty text for an empty array', () => {
    expect(stringifySequence([])).toBe('');
  });

  it('writes canonical JSON records', () => {
    expect(stringifySequence([{ b: 1, a: 2 }], 'canonical')).toBe('\u001E{"a":2,"b":1}\n');
  });

  it('throws a TypeError on a value with no JSON representation', () => {
    expect(() => stringifySequence([Symbol('s')])).toThrow('stringifySequence: the value at index 0 (symbol) has no JSON representation');
  });

  it('throws a TypeError when values is not an array', () => {
    expect(() => stringifySequence(null as unknown as unknown[])).toThrow('stringifySequence: expected an array of values, got null');
  });
});
