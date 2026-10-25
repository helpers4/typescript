/**
 * This file is part of helpers4.
 * Copyright (C) 2026 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * Internal implementation of the `'alpine'` format of parseDependencies / stringifyDependencies.
 * TODO: not implemented yet.
 */

import type { AlpineDependency, DependencyGroup } from './types';

/** @ignore */
export function parseAlpine(field: string): DependencyGroup<AlpineDependency>[] {
  throw new Error(`parseDependencies: the 'alpine' format is not implemented yet (${field.length} characters)`);
}

/** @ignore */
export function stringifyAlpine(groups: readonly DependencyGroup<AlpineDependency>[]): string {
  throw new Error(`stringifyDependencies: the 'alpine' format is not implemented yet (${groups.length} groups)`);
}
