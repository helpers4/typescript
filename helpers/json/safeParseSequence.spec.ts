/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { safeParseSequence } from './safeParseSequence';

describe('safeParseSequence — property-based', () => {
  it('never throws, for any string', () => {
    fc.assert(fc.property(fc.string(), (text) => {
      expect(() => safeParseSequence(text)).not.toThrow();
    }));
  });
});
