/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { safeParseLines } from './safeParseLines';

describe('safeParseLines', () => {
  it('returns the parsed values', () => {
    expect(safeParseLines('1\n2\n')).toEqual([1, 2]);
  });

  it('returns null on invalid input when no fallback is given', () => {
    expect(safeParseLines('1\n{')).toBeNull();
  });

  it('returns the fallback on invalid input', () => {
    expect(safeParseLines('1\n{', [])).toEqual([]);
  });

  it('returns an explicit undefined fallback rather than null', () => {
    expect(safeParseLines('1\n{', undefined)).toBeUndefined();
  });

  it('forwards the options', () => {
    expect(safeParseLines('1\n\n2', null, { blankLines: 'fail' })).toBeNull();
    expect(safeParseLines('1\n{\n2', null, { invalidLines: 'skip' })).toEqual([1, 2]);
  });
});
