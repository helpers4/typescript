/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { createSafeMatcher } from './createSafeMatcher';

describe('createSafeMatcher — property-based', () => {
  it('never throws, whatever the patterns and syntax', () => {
    fc.assert(fc.property(fc.array(fc.string(), { maxLength: 4 }), fc.constantFrom('auto', 'glob', 'regex' as const), (patterns, syntax) => {
      expect(() => createSafeMatcher(patterns, { syntax })).not.toThrow();
    }));
  });
});
