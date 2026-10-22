/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expectTypeOf, it } from 'vitest';
import type { DeepSet } from './DeepSet';

describe('DeepSet — type tests', () => {
  it('replaces the value type at an existing path', () => {
    type Obj = { a: { b: number; c: string } };
    type Result = DeepSet<Obj, ['a', 'b'], string>;
    expectTypeOf<Result>().toEqualTypeOf<{ a: { b: string; c: string } }>();
  });

  it('replaces the whole type when the path is empty', () => {
    type Result = DeepSet<{ a: number }, [], string>;
    expectTypeOf<Result>().toEqualTypeOf<string>();
  });

  it('adds a brand-new key alongside existing ones instead of resolving to never', () => {
    type Obj = { a: { b: number } };
    type Result = DeepSet<Obj, ['a', 'c'], string>;
    expectTypeOf<Result['a']['c']>().toEqualTypeOf<string>();
    expectTypeOf<Result['a']['b']>().toEqualTypeOf<number>();
  });

  it('builds a deeply nested new path that does not exist at all on T', () => {
    type Obj = { a: { b: number } };
    type Result = DeepSet<Obj, ['x', 'y', 'z'], boolean>;
    expectTypeOf<Result['x']['y']['z']>().toEqualTypeOf<boolean>();
    expectTypeOf<Result['a']['b']>().toEqualTypeOf<number>();
  });
});
