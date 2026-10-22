/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/*
 * This program is under the terms of the GNU Lesser General Public License version 3
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { expect, test } from "vitest";
import { firstValueFrom, of } from "rxjs";
import { combineLatest } from "./combineLatest";

test("combineLatest with array", async () => {
  const result = await firstValueFrom(combineLatest([of(1), of(2)]));
  return expect(result).toEqual([1, 2]);
});

test("combineLatest with object", async () => {
  const result = await firstValueFrom(combineLatest({ a: of(1), b: of(2) }));
  return expect(result).toEqual({ a: 1, b: 2 });
});

test("combineLatest with empty array", async () => {
  const result = await firstValueFrom(combineLatest([]));
  return expect(result).toEqual([]);
});

test("combineLatest with empty object", async () => {
  const result = await firstValueFrom(combineLatest({}));
  return expect(result).toEqual({});
});

// --- Mutation-killing tests ---

// L56: MethodExpression: input.filter -> input (skips filtering for arrays)
// If filtering is skipped, falsy values in array would be passed through
test("combineLatest with array containing falsy values", async () => {
  const result = await firstValueFrom(combineLatest([of(1), null as any, of(2)]));
  // Filter removes null, so should combine remaining observables
  expect(result).toEqual([1, 2]);
});

// L59: MethodExpression: Object.entries(input).filter -> Object.entries(input) (skips filtering for objects)
test("combineLatest with object containing falsy values", async () => {
  const result = await firstValueFrom(combineLatest({ a: of(1), b: null as any, c: of(2) }));
  // Filter removes null entry, so should combine remaining
  expect(result).toEqual({ a: 1, c: 2 });
});
