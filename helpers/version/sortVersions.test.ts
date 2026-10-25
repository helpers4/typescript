/**
 * This file is part of helpers4.
 * Copyright (C) 2026 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { sortVersions } from './sortVersions';

describe('sortVersions', () => {
  it('sorts by version, not by text', () => {
    expect(sortVersions(['1.10.0', '1.2.0', '1.9.0'])).toEqual(['1.2.0', '1.9.0', '1.10.0']);
  });

  it('sorts newest first with order desc', () => {
    expect(sortVersions(['1.2.0', '1.10.0', '1.9.0'], { order: 'desc' })).toEqual(['1.10.0', '1.9.0', '1.2.0']);
  });

  it('puts a prerelease before its release', () => {
    expect(sortVersions(['1.0.0', '1.0.0-rc.1', '1.0.0-beta'], { order: 'desc' })).toEqual(['1.0.0', '1.0.0-rc.1', '1.0.0-beta']);
  });

  it('keeps strings as written, v prefix included', () => {
    expect(sortVersions(['v2.0.0', 'v1.5.0', 'v10.0.0'], { order: 'desc' })).toEqual(['v10.0.0', 'v2.0.0', 'v1.5.0']);
  });

  it('does not mutate its input and returns a new array', () => {
    const input = ['2.0.0', '1.0.0'];
    const output = sortVersions(input);
    expect(input).toEqual(['2.0.0', '1.0.0']);
    expect(output).not.toBe(input);
  });

  it('keeps the order of equal versions', () => {
    expect(sortVersions(['1.0.0+b', '1.0.0+a', '0.1.0'])).toEqual(['0.1.0', '1.0.0+b', '1.0.0+a']);
    expect(sortVersions(['1.0.0+b', '1.0.0+a'], { order: 'desc' })).toEqual(['1.0.0+b', '1.0.0+a']);
  });

  it('handles empty and single-item lists', () => {
    expect(sortVersions([])).toEqual([]);
    expect(sortVersions(['1.0.0'])).toEqual(['1.0.0']);
  });

  it('sorts in another scheme', () => {
    expect(sortVersions(['1.0', '1.0~rc1', '1:0.5'], { scheme: 'debian' })).toEqual(['1.0~rc1', '1.0', '1:0.5']);
    expect(sortVersions(['1.0', '1.0a1', '1.0.post1'], { scheme: 'pep440', order: 'desc' })).toEqual(['1.0.post1', '1.0', '1.0a1']);
  });

  it('throws a SyntaxError for an invalid version in a strict scheme', () => {
    expect(() => sortVersions(['1.0', 'a b'], { scheme: 'debian' })).toThrow(SyntaxError);
  });
});
