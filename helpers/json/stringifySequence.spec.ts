/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { stringifySequence } from './stringifySequence';

describe('stringifySequence — property-based', () => {
  it('writes one RS-framed record per value', () => {
    fc.assert(fc.property(fc.array(fc.jsonValue()), (values) => {
      const records = stringifySequence(values).split('\u001E').slice(1);
      expect(records).toEqual(values.map((value) => `${JSON.stringify(value)}\n`));
    }));
  });
});
