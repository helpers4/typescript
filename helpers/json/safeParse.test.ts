/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { safeParse } from './safeParse';

describe('safeParse', () => {
  it('returns the parsed value for JSON and JSONC', () => {
    expect(safeParse('{"a":1}')).toEqual({ a: 1 });
    expect(safeParse('{"a":1, /* c */}')).toEqual({ a: 1 });
  });

  it('returns null on invalid input when no fallback is given', () => {
    expect(safeParse('{a:1}')).toBeNull();
  });

  it('returns the fallback on invalid input', () => {
    expect(safeParse('{a:1}', [])).toEqual([]);
  });

  it('returns an explicit undefined fallback rather than null', () => {
    expect(safeParse('{a:1}', undefined)).toBeUndefined();
  });
});
