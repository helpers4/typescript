/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expectTypeOf, it } from 'vitest';
import type { DeepPartial } from './DeepPartial';

describe('DeepPartial — type tests', () => {
  it('makes all properties optional on a flat object', () => {
    type Input = { name: string; age: number };
    type Result = DeepPartial<Input>;
    expectTypeOf<Result>().toMatchTypeOf<{ name?: string; age?: number }>();
  });

  it('recurses into nested objects', () => {
    type Input = { server: { host: string; port: number }; debug: boolean };
    type Result = DeepPartial<Input>;
    expectTypeOf<Result>().toMatchTypeOf<{ server?: { host?: string; port?: number }; debug?: boolean }>();
  });

  it('unwraps array elements recursively', () => {
    type Input = { items: { id: number; label: string }[] };
    type Result = DeepPartial<Input>;
    expectTypeOf<Result['items']>().toMatchTypeOf<{ id?: number; label?: string }[] | undefined>();
  });

  it('preserves Date as-is (does not decompose into methods)', () => {
    type Input = { createdAt: Date; name: string };
    type Result = DeepPartial<Input>;
    expectTypeOf<NonNullable<Result['createdAt']>>().toEqualTypeOf<Date>();
  });

  it('preserves Map as-is', () => {
    type Input = { lookup: Map<string, number> };
    type Result = DeepPartial<Input>;
    expectTypeOf<NonNullable<Result['lookup']>>().toEqualTypeOf<Map<string, number>>();
  });

  it('preserves Set as-is', () => {
    type Input = { tags: Set<string> };
    type Result = DeepPartial<Input>;
    expectTypeOf<NonNullable<Result['tags']>>().toEqualTypeOf<Set<string>>();
  });

  it('preserves Promise as-is', () => {
    type Input = { task: Promise<string> };
    type Result = DeepPartial<Input>;
    expectTypeOf<NonNullable<Result['task']>>().toEqualTypeOf<Promise<string>>();
  });

  it('preserves RegExp as-is', () => {
    type Input = { pattern: RegExp };
    type Result = DeepPartial<Input>;
    expectTypeOf<NonNullable<Result['pattern']>>().toEqualTypeOf<RegExp>();
  });

  it('preserves function signatures', () => {
    type Input = { handler: (x: number) => string };
    type Result = DeepPartial<Input>;
    expectTypeOf<NonNullable<Result['handler']>>().toEqualTypeOf<(x: number) => string>();
  });

  it('handles readonly arrays', () => {
    type Input = readonly string[];
    type Result = DeepPartial<Input>;
    expectTypeOf<Result>().toMatchTypeOf<readonly string[]>();
  });

  it('primitives pass through unchanged', () => {
    expectTypeOf<DeepPartial<string>>().toEqualTypeOf<string>();
    expectTypeOf<DeepPartial<number>>().toEqualTypeOf<number>();
    expectTypeOf<DeepPartial<boolean>>().toEqualTypeOf<boolean>();
  });
});
