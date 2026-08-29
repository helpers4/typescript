/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 *
 * Internal exhaustiveness-check helper shared by parse.ts, compare.ts, stringify.ts, and
 * isPrerelease.ts. A `switch` with no `default` case body other than this call makes
 * TypeScript refuse to compile if a new VersionScheme value is added to types.ts without
 * updating every dispatcher to handle it.
 */

/**
 * The `never` parameter type is what makes the exhaustiveness check work — callers switching
 * on `scheme`/`parsed.scheme` can only reach the `default` branch calling this with a value
 * TypeScript has narrowed to `never` after covering every known case, so a missing case is a
 * compile error rather than a silent fallthrough. That same `never` narrowing means a caller
 * can't do `scheme.someProperty` to build a nicer message before calling this — so unlike a
 * bare `String(scheme)`, which renders any object argument as the useless `[object Object]`,
 * this renders objects as JSON so a bogus `{ scheme: 'bogus', ... }` value (passed whole, as
 * stringify.ts/isPrerelease.ts's object-input overloads have to) still names the actual value.
 * @ignore
 */
export function assertNeverScheme(scheme: never): never {
  const rendered = typeof scheme === 'object' && scheme !== null ? JSON.stringify(scheme) : String(scheme);
  throw new Error(`Unhandled version scheme: ${rendered}`);
}
