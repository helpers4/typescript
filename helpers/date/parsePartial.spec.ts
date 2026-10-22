/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { parsePartial } from './parsePartial';

const pad = (n: number, width: number) => String(n).padStart(width, '0');

describe('parsePartial — property-based', () => {
  it('a valid full day keeps its own year, month and day', () => {
    fc.assert(fc.property(fc.integer({ min: 1000, max: 2999 }), fc.integer({ min: 1, max: 12 }), fc.integer({ min: 1, max: 28 }), (y, m, d) => {
      const parsed = parsePartial(`${pad(y, 4)}-${pad(m, 2)}-${pad(d, 2)}`)!;
      expect(parsed.precision).toBe('day');
      expect([parsed.date.getUTCFullYear(), parsed.date.getUTCMonth() + 1, parsed.date.getUTCDate()]).toEqual([y, m, d]);
    }));
  });

  it('a partial date lands inside its own period', () => {
    fc.assert(fc.property(fc.integer({ min: 1000, max: 2999 }), fc.integer({ min: 1, max: 12 }), (y, m) => {
      expect(parsePartial(pad(y, 4))!.date.getUTCFullYear()).toBe(y);
      const month = parsePartial(`${pad(y, 4)}-${pad(m, 2)}`)!;
      expect([month.date.getUTCFullYear(), month.date.getUTCMonth() + 1]).toEqual([y, m]);
    }));
  });

  it('never throws', () => {
    fc.assert(fc.property(fc.string(), (s) => {
      const r = parsePartial(s);
      expect(r === null || r.date instanceof Date).toBe(true);
    }));
  });
});

describe('parsePartial — contract', () => {
  it('returns UTC midnight', () => {
    expect(parsePartial('2008-03-09')!.date.getTime() % 86_400_000).toBe(0);
  });
});
