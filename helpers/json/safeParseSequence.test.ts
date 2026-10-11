/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { safeParseSequence } from './safeParseSequence';

const RS = '\u001E';

describe('safeParseSequence', () => {
  it('returns the parsed values', () => {
    expect(safeParseSequence(`${RS}1\n`)).toEqual([1]);
  });

  it('returns null on invalid input when no fallback is given', () => {
    expect(safeParseSequence(`${RS}{\n`)).toBeNull();
  });

  it('returns the fallback on invalid input', () => {
    expect(safeParseSequence(`${RS}{\n`, [])).toEqual([]);
  });

  it('returns an explicit undefined fallback rather than null', () => {
    expect(safeParseSequence(`${RS}{\n`, undefined)).toBeUndefined();
  });

  it('forwards the options', () => {
    expect(safeParseSequence(`${RS}{\n${RS}2\n`, null, { invalidRecords: 'skip' })).toEqual([2]);
  });
});
