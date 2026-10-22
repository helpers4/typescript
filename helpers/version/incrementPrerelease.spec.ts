/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { incrementPrerelease } from './incrementPrerelease';
import { parse } from './parse';

const semverArb = fc
  .tuple(fc.nat(20), fc.nat(20), fc.nat(20))
  .map(([major, minor, patch]) => `${major}.${minor}.${patch}`);

const prereleaseIdArb = fc.stringMatching(/^[a-z]+$/).filter(s => s.length > 0);

describe('incrementPrerelease — property-based', () => {
  it('the result always parses as a valid semver with a two-part <id>.<number> prerelease', () => {
    fc.assert(
      fc.property(semverArb, prereleaseIdArb, (version, id) => {
        const result = incrementPrerelease(version, id);
        const parsed = parse(result);
        expect(parsed.prerelease).toHaveLength(2);
        expect(parsed.prerelease[0]).toBe(id);
        expect(Number.isFinite(Number(parsed.prerelease[1]))).toBe(true);
      })
    );
  });

  it('build metadata is always dropped from the result', () => {
    fc.assert(
      fc.property(semverArb, prereleaseIdArb, fc.string({ minLength: 1 }), (version, id, buildMeta) => {
        const result = incrementPrerelease(`${version}+${buildMeta}`, id);
        expect(parse(result).build).toEqual([]);
      })
    );
  });

  it('applying it twice with the same id always increments the counter by exactly 1 the second time', () => {
    fc.assert(
      fc.property(semverArb, prereleaseIdArb, (version, id) => {
        const once = incrementPrerelease(version, id);
        const twice = incrementPrerelease(once, id);
        const numOnce = Number(parse(once).prerelease[1]);
        const numTwice = Number(parse(twice).prerelease[1]);
        expect(numTwice).toBe(numOnce + 1);
      })
    );
  });

  it('null and undefined always pass through unchanged, regardless of prereleaseId', () => {
    fc.assert(
      fc.property(prereleaseIdArb, id => {
        expect(incrementPrerelease(null, id)).toBeNull();
        expect(incrementPrerelease(undefined, id)).toBeUndefined();
      })
    );
  });
});
