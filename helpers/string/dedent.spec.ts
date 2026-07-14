/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { dedent } from './dedent';

describe('dedent — property-based', () => {
  it('adding the same amount of leading spaces to every line is fully undone', () => {
    fc.assert(
      fc.property(
        fc.array(fc.stringMatching(/^[a-zA-Z0-9]+$/), { minLength: 1, maxLength: 5 }),
        fc.integer({ min: 0, max: 10 }),
        (words, padSize) => {
          const pad = ' '.repeat(padSize);
          const input = words.map((w) => pad + w).join('\n');
          expect(dedent(input)).toBe(words.join('\n'));
        },
      ),
    );
  });

  it('never throws and never produces more lines than the input', () => {
    fc.assert(
      fc.property(fc.array(fc.string({ maxLength: 20 }), { minLength: 1, maxLength: 5 }), (lines) => {
        const input = lines.join('\n');
        const result = dedent(input);
        expect(result.split('\n').length).toBeLessThanOrEqual(input.split('\n').length);
      }),
    );
  });
});
