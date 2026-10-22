/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { pipe } from './pipe';

describe('pipe', () => {
  it('applies functions left-to-right', () => {
    const result = pipe(
      (x: number) => x + 1,
      (x: number) => x * 2
    )(3);
    expect(result).toBe(8);
  });

  it('with single function behaves like identity', () => {
    const fn = pipe((x: number) => x * 10);
    expect(fn(5)).toBe(50);
  });

  it('chains string transformations', () => {
    const process = pipe(
      (s: string) => s.trim(),
      (s: string) => s.toLowerCase(),
      (s: string) => s.replace(/\s+/g, '-')
    );
    expect(process('  Hello World  ')).toBe('hello-world');
  });

  it('passes value through 4 functions', () => {
    const result = pipe(
      (x: number) => x + 1,
      (x: number) => x * 2,
      (x: number) => x - 3,
      (x: number) => x / 2
    )(5);
    // ((5+1)*2-3)/2 = (12-3)/2 = 9/2 = 4.5
    expect(result).toBe(4.5);
  });

  it('handles type transformations across steps', () => {
    const result = pipe(
      (x: number) => x * 2,
      String,
      (s: string) => s + '!'
    )(21);
    expect(result).toBe('42!');
  });
});
