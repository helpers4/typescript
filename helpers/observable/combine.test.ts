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
import { firstValueFrom, map, of } from "rxjs";
import { combine } from "./combine";

test("combine", async () => {
  const result = await firstValueFrom(
    combine(of(1), of(2), (c) => c[0] + c[1])
  );
  return expect(result).toBe(3);
});

test("combine with pretreatment", async () => {
  const result = await firstValueFrom(
    combine(of(1), of(2), (c) => c[0] + c[1], {
      preTreatment: map((c) => [c[0], c[1] + 1]),
    })
  );
  return expect(result).toBe(4);
});
