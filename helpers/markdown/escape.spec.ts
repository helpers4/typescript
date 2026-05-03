/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { escape } from './escape';

const SPECIAL_CHARS = ['\\', '`', '*', '_', '{', '}', '[', ']', '(', ')', '#', '+', '-', '.', '!'];

describe('escape — property-based', () => {
  it('result has no unescaped special characters', () => {
    fc.assert(
      fc.property(fc.string(), (str) => {
        const result = escape(str);
        // Strip all properly escaped chars, the remaining must not contain any special char
        const stripped = result.replace(/\\[\\`*_{}[\]()#+\-.!]/g, '');
        for (const ch of SPECIAL_CHARS) {
          expect(stripped).not.toContain(ch);
        }
      })
    );
  });

  it('idempotent after double-escaping', () => {
    fc.assert(
      fc.property(fc.string(), (str) => {
        // escape(escape(str)) should not throw
        expect(() => escape(escape(str))).not.toThrow();
      })
    );
  });
});
