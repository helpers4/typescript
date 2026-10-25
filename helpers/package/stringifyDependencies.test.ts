/**
 * This file is part of helpers4.
 * Copyright (C) 2026 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { parseDependencies } from './parseDependencies';
import { stringifyDependencies } from './stringifyDependencies';

describe('stringifyDependencies', () => {
  it('returns an empty string for no groups', () => {
    expect(stringifyDependencies([])).toBe('');
  });

  it('writes a bare name', () => {
    expect(stringifyDependencies([[{ name: 'a' }]])).toBe('a');
  });

  it('writes every part in canonical order and spacing', () => {
    expect(
      stringifyDependencies([
        [{ name: 'libc6', version: { operator: '>=', version: '2.34' } }],
        [
          { name: 'python3', arch: 'any' },
          { name: 'python3', version: { operator: '>=', version: '3.8' }, architectures: ['amd64', '!i386'] },
        ],
        [{ name: 'foo', profiles: [['!nocheck', 'cross'], ['stage1']] }],
      ]),
    ).toBe('libc6 (>= 2.34), python3:any | python3 (>= 3.8) [amd64 !i386], foo <!nocheck cross> <stage1>');
  });

  it('leaves out empty architecture and profile lists', () => {
    expect(stringifyDependencies([[{ name: 'a', architectures: [], profiles: [] }]])).toBe('a');
  });

  it('normalises the whitespace of a parsed field', () => {
    const field = 'libc6   (>=2.34) ,\n python3:any|python3 [ amd64 ] <!nocheck>';
    expect(stringifyDependencies(parseDependencies(field))).toBe(
      'libc6 (>= 2.34), python3:any | python3 [amd64] <!nocheck>',
    );
  });

  it('round-trips with parseDependencies', () => {
    const groups = parseDependencies('a (<< 1), b:any | c (= 1:2-3~x) [!arm64] <!nocheck> <cross>');
    expect(parseDependencies(stringifyDependencies(groups))).toEqual(groups);
  });

  it('writes the operators as they are', () => {
    const groups = [
      [{ name: 'a', version: { operator: '<<' as const, version: '1' } }],
      [{ name: 'b', version: { operator: '>>' as const, version: '2' } }],
      [{ name: 'c', version: { operator: '=' as const, version: '3' } }],
    ];
    expect(stringifyDependencies(groups)).toBe('a (<< 1), b (>> 2), c (= 3)');
  });

  it('throws a RangeError for a format that is not supported', () => {
    expect(() => stringifyDependencies([], 'rpm' as 'debian')).toThrow(RangeError);
  });
});
