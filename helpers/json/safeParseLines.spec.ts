/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { safeParseLines } from './safeParseLines';

describe('safeParseLines — property-based', () => {
  it('never throws, for any string and options', () => {
    fc.assert(fc.property(
      fc.string(),
      fc.constantFrom('skip' as const, 'fail' as const),
      fc.constantFrom('skip' as const, 'fail' as const),
      (text, blankLines, invalidLines) => {
        expect(() => safeParseLines(text, null, { blankLines, invalidLines })).not.toThrow();
      },
    ));
  });
});
