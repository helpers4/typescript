/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 *
 * Internal exhaustiveness-check helper shared by parse.ts, compare.ts, and stringify.ts.
 * A `switch` with no `default` case body other than this call makes TypeScript refuse to
 * compile if a new VersionScheme value is added to types.ts without updating all three
 * dispatchers to handle it.
 */

/** @ignore */
export function assertNeverScheme(scheme: never): never {
  throw new Error(`Unhandled version scheme: ${String(scheme)}`);
}
