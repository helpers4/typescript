/**
 * This file is part of helpers4.
 * Copyright (C) 2026 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, expectTypeOf, it } from 'vitest';
import { stringifyDependencies } from './stringifyDependencies';
import type { DependencyFormat } from './types';

describe('stringifyDependencies', () => {
  it('needs a format', () => {
    // @ts-expect-error the format has no default
    expect(() => stringifyDependencies([])).toThrow(RangeError);
  });

  it('throws a RangeError for a format that is not supported', () => {
    expect(() => stringifyDependencies([], 'npm' as DependencyFormat)).toThrow(/unsupported format "npm"/);
  });

  it('writes the Debian format', () => {
    expect(stringifyDependencies([[{ name: 'a', version: { operator: '>=', version: '1' } }, { name: 'b' }]], 'debian')).toBe('a (>= 1) | b');
  });

  it('types the groups after the format', () => {
    expectTypeOf(stringifyDependencies).returns.toEqualTypeOf<string>();
    // Only needs to compile (or not): never run.
    void (() => {
      // @ts-expect-error `~=` is not a Debian operator
      stringifyDependencies([[{ name: 'a', version: { operator: '~=', version: '1' } }]], 'debian');
      // @ts-expect-error `conflict` belongs to the Alpine format
      stringifyDependencies([[{ name: 'a', conflict: true }]], 'debian');
    });
  });
});
