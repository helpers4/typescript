/**
 * This file is part of helpers4.
 * Copyright (C) 2026 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { compare } from './compare';
import { sortVersions } from './sortVersions';

const version = fc.tuple(fc.nat(30), fc.nat(30), fc.nat(30)).map(([a, b, c]) => `${a}.${b}.${c}`);

describe('sortVersions — property-based', () => {
  it('returns an ordered permutation of its input', () => {
    fc.assert(
      fc.property(fc.array(version), (versions) => {
        const sorted = sortVersions(versions);
        expect(sorted).toHaveLength(versions.length);
        expect(sorted.toSorted()).toEqual(versions.toSorted());
        for (let i = 1; i < sorted.length; i++) expect(compare(sorted[i - 1]!, sorted[i]!)).toBeLessThanOrEqual(0);
      }),
    );
  });

  it('desc is the reverse of asc for distinct versions', () => {
    fc.assert(
      fc.property(fc.uniqueArray(version), (versions) => {
        expect(sortVersions(versions, { order: 'desc' })).toEqual(sortVersions(versions).toReversed());
      }),
    );
  });
});
