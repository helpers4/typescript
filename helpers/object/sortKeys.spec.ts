/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { UNSAFE_KEYS } from '../_shared/_unsafeKeys';
import { sortKeys } from './sortKeys';

// Integer-index-like keys ("0", "1", "42"...) are always iterated first by the JS engine,
// in numeric order, regardless of insertion order — excluded here since no implementation
// of sortKeys can override that language-level behavior. Prototype-polluting keys are also
// excluded — sortKeys deliberately skips them (see sortKeys.test.ts), so a generic
// "preserves every key" property doesn't hold for them.
const nonIndexKey = fc
  .string({ minLength: 1 })
  .filter((s) => !/^(?:0|[1-9]\d*)$/.test(s) && !UNSAFE_KEYS.has(s));

describe('sortKeys — property-based', () => {
  it('never changes the set of keys or their values', () => {
    fc.assert(
      fc.property(fc.dictionary(nonIndexKey, fc.integer()), (obj) => {
        const result = sortKeys(obj);
        expect(result).toEqual(obj);
      }),
    );
  });

  it('resulting keys are in sorted order', () => {
    fc.assert(
      fc.property(fc.dictionary(nonIndexKey, fc.integer()), (obj) => {
        const keys = Object.keys(sortKeys(obj));
        expect(keys).toEqual([...keys].sort());
      }),
    );
  });
});

describe('sortKeys — contract', () => {
  it('empty object stays empty', () => {
    expect(sortKeys({})).toEqual({});
  });
});
