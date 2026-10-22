/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { Readable, Writable } from 'node:stream';
import { describe, expect, it } from 'vitest';
import { isNodeStream } from './isNodeStream';

describe('isNodeStream — property-based', () => {
  it('primitives are never streams', () => {
    fc.assert(
      fc.property(fc.oneof(fc.string(), fc.integer(), fc.boolean()), (value) => {
        expect(isNodeStream(value)).toBe(false);
      }),
    );
  });
});

describe('isNodeStream — contract', () => {
  it('null → false', () => expect(isNodeStream(null)).toBe(false));
  it('undefined → false', () => expect(isNodeStream(undefined)).toBe(false));
  it('{} → false', () => expect(isNodeStream({})).toBe(false));
  it('{ pipe: non-fn } → false', () => expect(isNodeStream({ pipe: 42 })).toBe(false));
  it('{ pipe: fn } → true', () => expect(isNodeStream({ pipe: () => {} })).toBe(true));
  it('Readable → true', () => expect(isNodeStream(new Readable({ read() {} }))).toBe(true));
  it('Writable → true', () => expect(isNodeStream(new Writable({ write() {} }))).toBe(true));
});
