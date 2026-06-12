/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expectTypeOf, it } from 'vitest';
import type { DeepWritable } from './DeepWritable';

describe('DeepWritable — type tests', () => {
  it('removes readonly from flat object properties', () => {
    type Input = { readonly name: string; readonly age: number };
    type Result = DeepWritable<Input>;
    expectTypeOf<Result>().toMatchTypeOf<{ name: string; age: number }>();
  });

  it('recurses into nested objects', () => {
    type Input = { readonly server: { readonly host: string; readonly port: number } };
    type Result = DeepWritable<Input>;
    expectTypeOf<Result>().toMatchTypeOf<{ server: { host: string; port: number } }>();
  });

  it('converts readonly array to mutable array', () => {
    type Input = { readonly tags: readonly string[] };
    type Result = DeepWritable<Input>;
    expectTypeOf<Result['tags']>().toEqualTypeOf<string[]>();
  });

  it('handles readonly tuples', () => {
    type Input = readonly [number, string];
    type Result = DeepWritable<Input>;
    expectTypeOf<Result[0]>().toEqualTypeOf<number>();
    expectTypeOf<Result[1]>().toEqualTypeOf<string>();
  });

  it('preserves Date as-is', () => {
    type Input = { readonly createdAt: Date };
    type Result = DeepWritable<Input>;
    expectTypeOf<Result['createdAt']>().toEqualTypeOf<Date>();
  });

  it('preserves Map as-is', () => {
    type Input = { readonly lookup: Map<string, number> };
    type Result = DeepWritable<Input>;
    expectTypeOf<Result['lookup']>().toEqualTypeOf<Map<string, number>>();
  });

  it('preserves Set as-is', () => {
    type Input = { readonly tags: Set<string> };
    type Result = DeepWritable<Input>;
    expectTypeOf<Result['tags']>().toEqualTypeOf<Set<string>>();
  });

  it('preserves Promise as-is', () => {
    type Input = { readonly task: Promise<string> };
    type Result = DeepWritable<Input>;
    expectTypeOf<Result['task']>().toEqualTypeOf<Promise<string>>();
  });

  it('preserves function signatures', () => {
    type Input = { readonly handler: (x: number) => string };
    type Result = DeepWritable<Input>;
    expectTypeOf<Result['handler']>().toEqualTypeOf<(x: number) => string>();
  });

  it('primitives pass through unchanged', () => {
    expectTypeOf<DeepWritable<string>>().toEqualTypeOf<string>();
    expectTypeOf<DeepWritable<number>>().toEqualTypeOf<number>();
    expectTypeOf<DeepWritable<boolean>>().toEqualTypeOf<boolean>();
  });
});
