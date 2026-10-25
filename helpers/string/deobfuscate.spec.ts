/**
 * This file is part of helpers4.
 * Copyright (C) 2026 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { deobfuscate } from './deobfuscate';
import { obfuscate } from './obfuscate';

describe('deobfuscate — property-based', () => {
  it('inverts obfuscate for any well-formed string, non-ASCII included', () => {
    fc.assert(
      fc.property(fc.string({ unit: 'binary' }), (text) => {
        expect(deobfuscate(obfuscate(text.toWellFormed()))).toBe(text.toWellFormed());
      }),
    );
  });

  it('never throws on any input, and returns a string or null', () => {
    fc.assert(
      fc.property(fc.anything(), (token) => {
        const result = deobfuscate(token as string);
        expect(result === null || typeof result === 'string').toBe(true);
      }),
    );
  });
});
