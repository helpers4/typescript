/**
 * This file is part of helpers4.
 * Copyright (C) 2026 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * Internal implementation of the `'pep508'` format of parseDependencies / stringifyDependencies.
 * TODO: not implemented yet.
 */

import type { DependencyGroup, Pep508Dependency } from './types';

/** @ignore */
export function parsePep508(field: string): DependencyGroup<Pep508Dependency>[] {
  throw new Error(`parseDependencies: the 'pep508' format is not implemented yet (${field.length} characters)`);
}

/** @ignore */
export function stringifyPep508(groups: readonly DependencyGroup<Pep508Dependency>[]): string {
  throw new Error(`stringifyDependencies: the 'pep508' format is not implemented yet (${groups.length} groups)`);
}
