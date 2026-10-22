/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { buildConventionalCommitRegex } from './buildConventionalCommitRegex';

const typeArb = fc.stringMatching(/^[A-Za-z]+$/).filter(value => value.length > 0);
const scopeArb = fc.stringMatching(/^[A-Za-z0-9_-]+$/).filter(value => value.length > 0);
const descriptionArb = fc.stringMatching(/^[A-Za-z0-9 _-]+$/).filter(value => value.length > 0);

describe('buildConventionalCommitRegex — property-based', () => {
  it('every well-formed `type: description` is matched by the default regex', () => {
    const regex = buildConventionalCommitRegex();
    fc.assert(
      fc.property(typeArb, descriptionArb, (type, description) => {
        expect(regex.test(`${type}: ${description}`)).toBe(true);
      }),
    );
  });

  it('every well-formed `type(scope): description` is matched by the default regex', () => {
    const regex = buildConventionalCommitRegex();
    fc.assert(
      fc.property(typeArb, scopeArb, descriptionArb, (type, scope, description) => {
        expect(regex.test(`${type}(${scope}): ${description}`)).toBe(true);
      }),
    );
  });

  it('breaking marker `!` is always accepted', () => {
    const regex = buildConventionalCommitRegex();
    fc.assert(
      fc.property(typeArb, descriptionArb, (type, description) => {
        expect(regex.test(`${type}!: ${description}`)).toBe(true);
      }),
    );
  });
});

describe('buildConventionalCommitRegex — contract', () => {
  it('default regex captures groups in order [type, scope, breaking, description]', () => {
    const match = buildConventionalCommitRegex().exec('feat(api)!: do thing');
    expect([match?.[1], match?.[2], match?.[3], match?.[4]]).toEqual([
      'feat',
      'api',
      '!',
      'do thing',
    ]);
  });

  it('returns a fresh RegExp on each invocation', () => {
    const a = buildConventionalCommitRegex();
    const b = buildConventionalCommitRegex();
    expect(a).not.toBe(b);
    expect(a.source).toBe(b.source);
  });
});
