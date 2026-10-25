/**
 * This file is part of helpers4.
 * Copyright (C) 2026 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * Internal implementation of the `'arch'` format of parseDependencies / stringifyDependencies.
 * TODO: not implemented yet.
 */

import type { ArchDependency, DependencyGroup } from './types';

/** @ignore */
export function parseArch(field: string): DependencyGroup<ArchDependency>[] {
  throw new Error(`parseDependencies: the 'arch' format is not implemented yet (${field.length} characters)`);
}

/** @ignore */
export function stringifyArch(groups: readonly DependencyGroup<ArchDependency>[]): string {
  throw new Error(`stringifyDependencies: the 'arch' format is not implemented yet (${groups.length} groups)`);
}
