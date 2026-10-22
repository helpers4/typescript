/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { parseStrict } from './parseStrict';
import { stringify } from './stringify';

const normalized = (value: unknown): unknown => JSON.parse(JSON.stringify(value));

describe('stringify — property-based', () => {
  it('writes text that reads back to the same value, whatever the indent', () => {
    fc.assert(fc.property(fc.jsonValue(), fc.integer({ min: 0, max: 10 }), (value, indent) => {
      expect(parseStrict(stringify(value, { indent }))).toEqual(normalized(value));
    }));
  });

  it('canonical: reads back to the same value', () => {
    fc.assert(fc.property(fc.jsonValue(), (value) => {
      expect(parseStrict(stringify(value, 'canonical'))).toEqual(normalized(value));
    }));
  });

  it('canonical: is idempotent', () => {
    fc.assert(fc.property(fc.jsonValue(), (value) => {
      const once = stringify(value, 'canonical');
      expect(stringify(parseStrict(once), 'canonical')).toBe(once);
    }));
  });

  it('canonical: does not depend on the order keys were inserted in', () => {
    fc.assert(fc.property(fc.dictionary(fc.string(), fc.jsonValue()), (object) => {
      const reversed = Object.fromEntries(Object.entries(object).toReversed());
      expect(stringify(reversed, 'canonical')).toBe(stringify(object, 'canonical'));
    }));
  });

  it('canonical: holds no whitespace outside strings', () => {
    fc.assert(fc.property(fc.jsonValue(), (value) => {
      const outsideStrings = stringify(value, 'canonical').replaceAll(/"(?:[^"\\]|\\.)*"/g, '""');
      expect(outsideStrings).not.toMatch(/\s/);
    }));
  });
});
