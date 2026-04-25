/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { parseConventionalCommit } from './parseConventionalCommit';

const typeArb = fc.stringMatching(/^[A-Za-z]+$/).filter(value => value.length > 0);
const scopeArb = fc.stringMatching(/^[A-Za-z0-9_-]+$/).filter(value => value.length > 0);
const descriptionArb = fc.stringMatching(/^[A-Za-z0-9 _-]+$/).filter(value => value.length > 0);

describe('parseConventionalCommit — property-based', () => {
  it('roundtrip: building a conventional subject always parses back', () => {
    fc.assert(
      fc.property(typeArb, descriptionArb, (type, description) => {
        const parsed = parseConventionalCommit(`${type}: ${description}`);
        expect(parsed?.type).toBe(type);
        expect(parsed?.description).toBe(description);
        expect(parsed?.scope).toBeNull();
        expect(parsed?.breaking).toBe(false);
      }),
    );
  });

  it('roundtrip with scope: scope is captured verbatim', () => {
    fc.assert(
      fc.property(typeArb, scopeArb, descriptionArb, (type, scope, description) => {
        const parsed = parseConventionalCommit(`${type}(${scope}): ${description}`);
        expect(parsed?.scope).toBe(scope);
      }),
    );
  });

  it('breaking marker `!` always toggles the breaking flag', () => {
    fc.assert(
      fc.property(typeArb, descriptionArb, (type, description) => {
        const parsed = parseConventionalCommit(`${type}!: ${description}`);
        expect(parsed?.breaking).toBe(true);
      }),
    );
  });
});

describe('parseConventionalCommit — contract', () => {
  it('"feat: add login" → type=feat, description=add login', () => {
    const result = parseConventionalCommit('feat: add login');
    expect(result?.type).toBe('feat');
    expect(result?.description).toBe('add login');
    expect(result?.scope).toBeNull();
  });

  it('"feat(api)!: x\\n\\nBREAKING CHANGE: y" → breaking=true', () => {
    const result = parseConventionalCommit('feat(api)!: x\n\nBREAKING CHANGE: y');
    expect(result?.breaking).toBe(true);
    expect(result?.scope).toBe('api');
  });

  it('"hello" → null', () => {
    expect(parseConventionalCommit('hello')).toBeNull();
  });
});
