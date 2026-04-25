/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { isConventionalCommit } from './isConventionalCommit';

const typeArb = fc.stringMatching(/^[A-Za-z]+$/).filter(value => value.length > 0);
const descriptionArb = fc.stringMatching(/^[A-Za-z0-9 _-]+$/).filter(value => value.length > 0);

describe('isConventionalCommit — property-based', () => {
  it('any well-formed `type: description` is accepted', () => {
    fc.assert(
      fc.property(typeArb, descriptionArb, (type, description) => {
        expect(isConventionalCommit(`${type}: ${description}`)).toBe(true);
      }),
    );
  });

  it('a leading garbage line always invalidates the message', () => {
    fc.assert(
      fc.property(typeArb, descriptionArb, (type, description) => {
        expect(isConventionalCommit(`garbage line\n${type}: ${description}`)).toBe(false);
      }),
    );
  });
});

describe('isConventionalCommit — contract', () => {
  it('"feat: x" → true', () => {
    expect(isConventionalCommit('feat: x')).toBe(true);
  });

  it('"hello" → false', () => {
    expect(isConventionalCommit('hello')).toBe(false);
  });
});
