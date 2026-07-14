/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { get } from './get';
import { set } from './set';
import { update } from './update';

const safeKey = fc.stringMatching(/^[a-zA-Z][a-zA-Z0-9]*$/);

describe('update — property-based', () => {
  it('always returns the same object reference', () => {
    fc.assert(
      fc.property(safeKey, fc.integer(), (key, value) => {
        const obj: Record<string, unknown> = { [key]: value };
        expect(update(obj, key, (n) => (n as number) + 1)).toBe(obj);
      }),
    );
  });

  it('is equivalent to set(obj, path, updater(get(obj, path)))', () => {
    fc.assert(
      fc.property(safeKey, fc.integer(), fc.integer(), (key, value, delta) => {
        const updater = (n: unknown) => (n as number) + delta;

        const viaUpdate: Record<string, unknown> = { [key]: value };
        update(viaUpdate, key, updater);

        const viaGetSet: Record<string, unknown> = { [key]: value };
        set(viaGetSet, key, updater(get(viaGetSet, key)));

        expect(viaUpdate).toEqual(viaGetSet);
      }),
    );
  });

  it('creates intermediate objects for a missing path, same as set()', () => {
    fc.assert(
      fc.property(safeKey, safeKey, fc.integer(), (outer, inner, value) => {
        fc.pre(outer !== inner);
        const obj: Record<string, unknown> = {};
        update(obj, `${outer}.${inner}`, () => value);
        expect((obj[outer] as Record<string, unknown>)[inner]).toBe(value);
      }),
    );
  });
});
