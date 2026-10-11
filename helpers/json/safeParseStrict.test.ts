/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { safeParseStrict } from './safeParseStrict';

describe('safeParseStrict', () => {
  it('returns the parsed value', () => {
    expect(safeParseStrict<{ a: number }>('{"a":1}')).toEqual({ a: 1 });
  });

  it('parses a JSON null as null, not as a failure', () => {
    expect(safeParseStrict('null', 'fallback')).toBeNull();
  });

  it('returns null on invalid input when no fallback is given', () => {
    expect(safeParseStrict('{"a":1,}')).toBeNull();
  });

  it('returns the fallback on invalid input', () => {
    const fallback = { empty: true };
    expect(safeParseStrict('oops', fallback)).toBe(fallback);
  });

  it('returns an explicit undefined fallback rather than null', () => {
    expect(safeParseStrict('oops', undefined)).toBeUndefined();
  });

  it('rejects JSONC, unlike safeParse', () => {
    expect(safeParseStrict('{"a":1} // note')).toBeNull();
  });
});
