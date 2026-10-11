/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { safeParse } from './safeParse';

describe('safeParse — property-based', () => {
  it('never throws, for any string', () => {
    fc.assert(fc.property(fc.string(), (text) => {
      expect(() => safeParse(text)).not.toThrow();
    }));
  });

  it('returns the value for every JSON text', () => {
    fc.assert(fc.property(fc.jsonValue(), (value) => {
      const text = JSON.stringify(value);
      expect(safeParse(text, Symbol('failed'))).toEqual(JSON.parse(text));
    }));
  });
});
