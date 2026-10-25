/**
 * This file is part of helpers4.
 * Copyright (C) 2026 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, expectTypeOf, it } from 'vitest';
import { parseDependencies } from './parseDependencies';
import type { DebianDependency, DependencyFormat } from './types';

describe('parseDependencies', () => {
  it('needs a format', () => {
    // @ts-expect-error the format has no default
    expect(() => parseDependencies('a')).toThrow(RangeError);
  });

  it('throws a RangeError for a format that is not supported', () => {
    expect(() => parseDependencies('a', 'npm' as DependencyFormat)).toThrow(RangeError);
    expect(() => parseDependencies('a', 'npm' as DependencyFormat)).toThrow(/unsupported format "npm"/);
  });

  it('reads the Debian format', () => {
    expect(parseDependencies('a (>= 1) | b', 'debian')).toEqual([[{ name: 'a', version: { operator: '>=', version: '1' } }, { name: 'b' }]]);
  });

  it('gives each format its own dependency type', () => {
    expectTypeOf(parseDependencies('a', 'debian')).toEqualTypeOf<DebianDependency[][]>();
    expectTypeOf(parseDependencies('a', 'debian')[0]![0]!.architectures).toEqualTypeOf<string[] | undefined>();
  });

  it('only accepts the options of the format that has some', () => {
    expect(parseDependencies('a (< 1)', 'debian', { compat: true })).toHaveLength(1);
    // The calls below only need to compile (or not): they are never run.
    void (() => {
      // @ts-expect-error only the Debian format has options
      parseDependencies('a', 'rpm', { compat: true });
      // @ts-expect-error `compat` is the only option of the Debian format
      parseDependencies('a', 'debian', { strict: true });
    });
  });
});
