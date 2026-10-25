/**
 * This file is part of helpers4.
 * Copyright (C) 2026 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * Internal implementation of the `'rpm'` format of parseDependencies / stringifyDependencies.
 * TODO: not implemented yet.
 */

import type { DependencyGroup, RpmDependency } from './types';

/** @ignore */
export function parseRpm(field: string): DependencyGroup<RpmDependency>[] {
  throw new Error(`parseDependencies: the 'rpm' format is not implemented yet (${field.length} characters)`);
}

/** @ignore */
export function stringifyRpm(groups: readonly DependencyGroup<RpmDependency>[]): string {
  throw new Error(`stringifyDependencies: the 'rpm' format is not implemented yet (${groups.length} groups)`);
}
