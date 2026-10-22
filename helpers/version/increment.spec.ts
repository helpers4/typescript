/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { compare } from './compare';
import { increment } from './increment';

const versionArb = fc.tuple(
  fc.nat({ max: 9 }),
  fc.nat({ max: 9 }),
  fc.nat({ max: 9 }),
).map(([major, minor, patch]) => `${major}.${minor}.${patch}`);

const releaseTypeArb = fc.constantFrom('major', 'minor', 'patch') as fc.Arbitrary<'major' | 'minor' | 'patch'>;

describe('increment — property-based', () => {
  it('incremented version is always greater than original', () => {
    fc.assert(
      fc.property(versionArb, releaseTypeArb, (version: string, type: 'major' | 'minor' | 'patch') => {
        const incremented = increment(version, type);
        expect(compare(incremented, version)).toBe(1);
      }),
    );
  });

  it('incrementing major resets minor and patch to 0', () => {
    fc.assert(
      fc.property(versionArb, (version: string) => {
        const result = increment(version, 'major');
        const parts = result.split('.').map(Number);
        expect(parts[1]).toBe(0);
        expect(parts[2]).toBe(0);
      }),
    );
  });

  it('incrementing minor resets patch to 0', () => {
    fc.assert(
      fc.property(versionArb, (version: string) => {
        const result = increment(version, 'minor');
        const parts = result.split('.').map(Number);
        expect(parts[2]).toBe(0);
      }),
    );
  });
});

describe('increment — contract', () => {
  it('"1.2.3" + "major" → "2.0.0"', () => {
    expect(increment('1.2.3', 'major')).toBe('2.0.0');
  });

  it('"1.2.3" + "minor" → "1.3.0"', () => {
    expect(increment('1.2.3', 'minor')).toBe('1.3.0');
  });

  it('"1.2.3" + "patch" → "1.2.4"', () => {
    expect(increment('1.2.3', 'patch')).toBe('1.2.4');
  });

  it('"v1.2.3" + "patch" → "v1.2.4" (preserves v prefix)', () => {
    expect(increment('v1.2.3', 'patch')).toBe('v1.2.4');
  });

  it('"1" + "minor" → "1.1.0" (handles partial version)', () => {
    expect(increment('1', 'minor')).toBe('1.1.0');
  });

  it('null → null', () => {
    expect(increment(null, 'patch')).toBeNull();
  });

  it('undefined → undefined', () => {
    expect(increment(undefined, 'patch')).toBeUndefined();
  });
});
