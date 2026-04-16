/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { toISO8601, toRFC3339, toRFC2822 } from './format';

// Constrain dates to 4-digit year range to avoid ISO string edge cases (negative years, <1000 years)
const YEAR_1000 = new Date('1000-01-01T00:00:00.000Z').getTime();
const YEAR_9999 = new Date('9999-12-31T23:59:59.999Z').getTime();
const recentDate = () =>
  fc
    .date({ min: new Date(YEAR_1000), max: new Date(YEAR_9999) })
    .filter((d) => !isNaN(d.getTime()));

const ISO_RE = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;

const RFC3339_RE = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$/;
const RFC2822_RE = /^\w{3}, \d{2} \w{3} \d{4} \d{2}:\d{2}:\d{2} \+0000$/;

describe('toISO8601 — property-based', () => {
  it('valid Date inputs always return a non-null string matching ISO format', () => {
    fc.assert(
      fc.property(recentDate(), (d) => {
        const result = toISO8601(d);
        expect(result).not.toBeNull();
        expect(typeof result).toBe('string');
        expect(result).toMatch(ISO_RE);
      })
    );
  });

  it('valid integer timestamps always return a non-null string', () => {
    fc.assert(
      fc.property(fc.integer({ min: 10_000_000_000, max: 2_000_000_000_000 }), (ts) => {
        const result = toISO8601(ts);
        expect(result).not.toBeNull();
      })
    );
  });
});

describe('toISO8601 — contract', () => {
  it('invalid Date → null', () => {
    expect(toISO8601(new Date('invalid'))).toBeNull();
  });

  it('null → null', () => {
    expect(toISO8601(null as unknown as Date)).toBeNull();
  });

  it('undefined → null', () => {
    expect(toISO8601(undefined as unknown as Date)).toBeNull();
  });

  it('integer timestamp (ms) → ISO string', () => {
    const result = toISO8601(1737290400000);
    expect(typeof result).toBe('string');
    expect(result).toMatch(ISO_RE);
  });

  it('ISO date string → ISO string', () => {
    const result = toISO8601('2025-01-19T12:00:00.000Z');
    expect(result).toMatch(ISO_RE);
  });

  it('Date(0) (epoch) → 1970-01-01T00:00:00.000Z', () => {
    expect(toISO8601(new Date(0))).toBe('1970-01-01T00:00:00.000Z');
  });

  it('future date → valid ISO string', () => {
    const result = toISO8601(new Date('2100-12-31T23:59:59.999Z'));
    expect(result).toMatch(ISO_RE);
  });
});

describe('toRFC3339 — property-based', () => {
  it('valid Date inputs return non-null string matching RFC3339 format', () => {
    fc.assert(
      fc.property(recentDate(), fc.boolean(), (d, includeMs) => {
        const result = toRFC3339(d, includeMs);
        expect(result).not.toBeNull();
        expect(result).toMatch(RFC3339_RE);
      })
    );
  });
});

describe('toRFC3339 — contract', () => {
  it('invalid Date → null', () => {
    expect(toRFC3339(new Date('invalid'))).toBeNull();
  });

  it('without milliseconds: no .sss in output', () => {
    const result = toRFC3339(new Date('2025-01-19T12:30:45.123Z'), false);
    expect(result).toBe('2025-01-19T12:30:45Z');
  });

  it('with milliseconds: .sss present in output', () => {
    const result = toRFC3339(new Date('2025-01-19T12:30:45.123Z'), true);
    expect(result).toBe('2025-01-19T12:30:45.123Z');
  });

  it('null → null', () => {
    expect(toRFC3339(null as unknown as Date)).toBeNull();
  });
});

describe('toRFC2822 — property-based', () => {
  it('valid Date inputs return non-null string matching RFC2822 format', () => {
    fc.assert(
      fc.property(recentDate(), (d) => {
        const result = toRFC2822(d);
        expect(result).not.toBeNull();
        expect(result).toMatch(RFC2822_RE);
      })
    );
  });
});

describe('toRFC2822 — contract', () => {
  it('invalid Date → null', () => {
    expect(toRFC2822(new Date('invalid'))).toBeNull();
  });

  it('known date formats correctly', () => {
    expect(toRFC2822(new Date('2025-01-19T12:30:00.000Z'))).toBe(
      'Sun, 19 Jan 2025 12:30:00 +0000'
    );
  });

  it('null → null', () => {
    expect(toRFC2822(null as unknown as Date)).toBeNull();
  });
});
