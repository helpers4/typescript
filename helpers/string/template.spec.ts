/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { template } from './template';

describe('template (property-based)', () => {
  it('a string with no placeholders is returned unchanged', () => {
    fc.assert(
      fc.property(
        fc.stringMatching(/^[^{}]*$/),
        fc.dictionary(fc.string(), fc.string()),
        (str, data) => {
          expect(template(str, data)).toBe(str);
        },
      ),
    );
  });

  it('result never contains {{...}} placeholders from the original template when all keys are provided', () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.record({
            key: fc.stringMatching(/^\w+$/),
            value: fc.string(),
          }),
          { maxLength: 5 },
        ),
        (entries) => {
          const data = Object.fromEntries(entries.map(({ key, value }) => [key, value]));
          const str = entries.map(({ key }) => `{{${key}}}`).join(' ');
          const result = template(str, data);
          expect(result).not.toMatch(/\{\{\w+\}\}/);
        },
      ),
    );
  });

  it('all provided values appear in the result when their key is used as a placeholder', () => {
    fc.assert(
      fc.property(
        fc.stringMatching(/^\w+$/),
        fc.stringMatching(/^[^{}]+$/),
        (key, value) => {
          const result = template(`{{${key}}}`, { [key]: value });
          expect(result).toBe(value);
        },
      ),
    );
  });
});
