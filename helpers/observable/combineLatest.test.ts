/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

/*
 * This program is under the terms of the GNU Affero General Public License version 3
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
