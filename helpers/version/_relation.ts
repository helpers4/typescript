/**
 * This file is part of helpers4.
 * Copyright (C) 2026 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 *
 * Internal relation-operator range check shared by the RPM and pacman schemes.
 */

/** @ignore */
const RELATION_RE = /^(<=|>=|==|=|<|>)?\s*(\S+)$/;

/**
 * Checks `version` against a dependency-style relation: `<`, `<=`, `=` (or `==`), `>=`, `>`
 * followed by a version, or a bare version for an exact match. Whitespace after the operator is allowed.
 * @ignore
 */
export function satisfiesRelation(version: string, range: string, compare: (a: string, b: string) => number, scheme: string): boolean {
  const [, operator = '=', target] = RELATION_RE.exec(range.trim()) ?? [];
  if (target === undefined) throw new SyntaxError(`satisfiesRange: "${range}" is not a valid ${scheme} relation (expected e.g. ">= 1.0")`);
  const order = compare(version, target);
  switch (operator) {
    case '<': return order < 0;
    case '<=': return order <= 0;
    case '>=': return order >= 0;
    case '>': return order > 0;
    default: return order === 0;
  }
}
