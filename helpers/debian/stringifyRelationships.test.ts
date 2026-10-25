/**
 * This file is part of helpers4.
 * Copyright (C) 2026 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { parseRelationships } from './parseRelationships';
import { stringifyRelationships } from './stringifyRelationships';

describe('stringifyRelationships', () => {
  it('returns an empty string for no groups', () => {
    expect(stringifyRelationships([])).toBe('');
  });

  it('writes a bare name', () => {
    expect(stringifyRelationships([[{ name: 'a' }]])).toBe('a');
  });

  it('writes every part in canonical order and spacing', () => {
    expect(
      stringifyRelationships([
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
    expect(stringifyRelationships([[{ name: 'a', architectures: [], profiles: [] }]])).toBe('a');
  });

  it('normalises the whitespace of a parsed field', () => {
    const field = 'libc6   (>=2.34) ,\n python3:any|python3 [ amd64 ] <!nocheck>';
    expect(stringifyRelationships(parseRelationships(field))).toBe(
      'libc6 (>= 2.34), python3:any | python3 [amd64] <!nocheck>',
    );
  });

  it('round-trips with parseRelationships', () => {
    const groups = parseRelationships('a (<< 1), b:any | c (= 1:2-3~x) [!arm64] <!nocheck> <cross>');
    expect(parseRelationships(stringifyRelationships(groups))).toEqual(groups);
  });
});
