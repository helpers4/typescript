/**
 * This file is part of helpers4.
 * Copyright (C) 2026 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { mediaTypeOf } from './mediaTypeOf';
import { mediaTypeOfPath } from './mediaTypeOfPath';
import { toHex } from './toHex';

describe('toHex — property-based', () => {
  it('writes two hex digits per byte, and parses back', () => {
    fc.assert(fc.property(fc.uint8Array({ maxLength: 64 }), (bytes) => {
      const hex = toHex(bytes);
      expect(hex).toMatch(/^(?:[0-9a-f]{2})*$/);
      expect(hex).toHaveLength(bytes.length * 2);
      expect(Uint8Array.from(hex.match(/../g) ?? [], (pair) => Number.parseInt(pair, 16))).toEqual(bytes);
    }));
  });
});

describe('media types — property-based', () => {
  it('mediaTypeOf never throws and answers a media type or nothing', () => {
    fc.assert(fc.property(fc.uint8Array({ maxLength: 64 }), (bytes) => {
      const type = mediaTypeOf(bytes);
      expect(type === undefined || /^image\/[a-z+]+$/.test(type)).toBe(true);
    }));
  });

  it('mediaTypeOfPath ignores the folders, the query and the case of a known extension', () => {
    fc.assert(fc.property(fc.stringMatching(/^[a-z0-9/]{0,12}$/), fc.constantFrom('png', 'PNG', 'Png'), fc.stringMatching(/^[a-z0-9=&]{0,8}$/), (dir, extension, query) => {
      expect(mediaTypeOfPath(`${dir}/file.${extension}?${query}`)).toBe('image/png');
    }));
  });
});
