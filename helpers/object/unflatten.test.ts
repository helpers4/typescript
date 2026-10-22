/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { flatten } from './flatten';
import { unflatten } from './unflatten';

describe('unflatten', () => {
  it('rebuilds a nested object from dot-notation keys', () => {
    expect(unflatten({ 'a.b.c': 1, 'a.d': 2 })).toEqual({ a: { b: { c: 1 }, d: 2 } });
  });

  it('leaves keys without dots unchanged', () => {
    expect(unflatten({ a: 1, b: 2 })).toEqual({ a: 1, b: 2 });
  });

  it('returns an empty object for an empty input', () => {
    expect(unflatten({})).toEqual({});
  });

  it('merges multiple keys under the same parent', () => {
    expect(unflatten({ 'a.x': 1, 'a.y': 2, 'a.z': 3 })).toEqual({ a: { x: 1, y: 2, z: 3 } });
  });

  it('round-trips through flatten for a plain-object structure', () => {
    const original = { a: { b: { c: 1 }, d: 2 }, e: 3 };
    expect(unflatten(flatten(original))).toEqual(original);
  });

  it('rejects prototype-polluting path segments (delegates to set()’s guard)', () => {
    const result = unflatten({ '__proto__.polluted': 'yes' });
    expect(({} as Record<string, unknown>)['polluted']).toBeUndefined();
    expect(result).toEqual({});
  });
});
