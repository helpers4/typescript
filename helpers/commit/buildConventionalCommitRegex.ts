/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import type { ConventionalCommitOptions } from './types';

const REGEX_SPECIAL = /[.*+?^${}()|[\]\\]/g;

function escapeForRegex(value: string): string {
  return value.replace(REGEX_SPECIAL, '\\$&');
}

function buildAlternation(values: readonly string[]): string {
  return values.map(escapeForRegex).join('|');
}

/**
 * Builds a regular expression matching the **subject line** of a Conventional
 * Commits message.
 *
 * The returned regex exposes four capture groups:
 *
 * 1. type
 * 2. scope (or `undefined` when absent)
 * 3. breaking marker (`'!'` or `undefined`)
 * 4. description
 *
 * @param options - Constrain accepted types/scopes and toggle scope requirement.
 * @returns Regex anchored on `^...$` matching the subject line only.
 * @example
 * buildConventionalCommitRegex().test('feat(api): add endpoint') // true
 * buildConventionalCommitRegex({ types: ['feat', 'fix'] }).test('chore: x') // false
 * buildConventionalCommitRegex({ requireScope: true }).test('feat: no scope') // false
 * @since 2.0.0
 */
export function buildConventionalCommitRegex(
  options: ConventionalCommitOptions = {},
): RegExp {
  const { types, scopes, requireScope = false } = options;

  const typePart = types && types.length > 0
    ? buildAlternation(types)
    : '[A-Za-z]+';

  const scopeContent = scopes && scopes.length > 0
    ? buildAlternation(scopes)
    : '[^\\s()]+';

  const scopeGroup = requireScope
    ? `\\((${scopeContent})\\)`
    : `(?:\\((${scopeContent})\\))?`;

  return new RegExp(`^(${typePart})${scopeGroup}(!)?: (.+)$`);
}
