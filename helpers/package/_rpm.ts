/**
 * This file is part of helpers4.
 * Copyright (C) 2026 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * RPM dependency tags (rpm-dependencies(7)): `Requires`, `BuildRequires`, `Conflicts`, `Provides`...
 * Internal implementation of the `'rpm'` format of parseDependencies / stringifyDependencies.
 *
 * Syntax read:
 * - entries are separated by commas and/or whitespace (newlines included);
 * - an entry is `name` or `name <op> version`, with whitespace around the operator; the operators
 *   are `<`, `<=`, `=`, `>=`, `>`, and `==`, which RPM accepts as a synonym of `=` and is read as `=`
 *   (the `<>` of rpm-dependencies(7) is not in the type and is refused);
 * - a name starts with a letter, a digit, `_` or `/` and may hold parentheses without whitespace
 *   (`perl(Foo::Bar)`, `libfoo.so.1()(64bit)`), which must be balanced;
 * - an entry starting with `(` is a rich dependency: `(a or b >= 1)`; nested `or` flatten.
 *   The operators `and`, `if`, `unless`, `with`, `without` and `else` are refused.
 *
 * Like RPM, `foo 1.0` is two entries (`foo` and `1.0`): a version is only recognised after an operator.
 */

import type { ComparisonOperator, DependencyGroup, RpmDependency } from './types';

/** The operators of rich dependencies that cannot be represented as alternatives. */
const UNSUPPORTED_OPERATORS = new Set(['and', 'if', 'unless', 'with', 'without', 'else']);

const OPERATORS: Record<string, ComparisonOperator> = {
  '<': '<',
  '<=': '<=',
  '=': '=',
  '==': '=',
  '>=': '>=',
  '>': '>',
};

const NAME_START_RE = /[A-Za-z0-9_/]/y;
const OPERATOR_RE = /[<>=!]+/y;
const VERSION_RE = /[^\s,()]*/y;
const WORD_RE = /[^\s,()]+/y;
const SPACE_RE = /\s*/y;
const SEPARATORS_RE = /[\s,]*/y;
const WHITESPACE_RE = /\s/;

/** The deepest nesting of rich dependencies accepted, which bounds the recursion. */
const MAX_DEPTH = 100;

/**
 * Parses the value of an RPM dependency tag.
 * @ignore
 */
export function parseRpm(field: string): DependencyGroup<RpmDependency>[] {
  let position = 0;
  const fail = (reason: string, start: number): never => {
    const text = field.slice(start, Math.max(position, start + 1));
    throw new SyntaxError(`parseDependencies: ${reason} in "${text}" (field "${field}")`);
  };
  const skip = (pattern: RegExp): void => {
    pattern.lastIndex = position;
    pattern.exec(field);
    position = pattern.lastIndex;
  };
  const take = (pattern: RegExp): string => {
    pattern.lastIndex = position;
    const match = pattern.exec(field);
    if (!match) return '';
    position = pattern.lastIndex;
    return match[0];
  };

  const parseName = (): string => {
    const start = position;
    NAME_START_RE.lastIndex = position;
    if (!NAME_START_RE.test(field)) {
      position = Math.min(position + 1, field.length);
      return fail('expected a capability name', start);
    }
    let depth = 0;
    for (; position < field.length; position++) {
      const char = field[position]!;
      if (char === ',' || WHITESPACE_RE.test(char)) break;
      if (char === '(') depth++;
      else if (char === ')') {
        if (depth === 0) break;
        depth--;
      } else if (depth === 0 && (char === '<' || char === '>' || char === '=')) {
        position++;
        return fail('an operator must be surrounded by whitespace', start);
      }
    }
    if (depth > 0) return fail('unbalanced parentheses', start);
    return field.slice(start, position);
  };

  const parseOperand = (): RpmDependency => {
    const start = position;
    const dependency: RpmDependency = { name: parseName() };
    const afterName = position;
    skip(SPACE_RE);
    const written = take(OPERATOR_RE);
    if (written === '') {
      position = afterName;
      return dependency;
    }
    const operator = OPERATORS[written];
    if (operator === undefined) return fail(`unknown operator "${written}"`, start);
    if (position >= field.length || field[position] === ')' || field[position] === ',') {
      return fail(`operator "${written}" without a version`, start);
    }
    if (!WHITESPACE_RE.test(field[position]!)) {
      position++;
      return fail('an operator must be surrounded by whitespace', start);
    }
    skip(SPACE_RE);
    const version = take(VERSION_RE);
    if (version === '') return fail(`operator "${written}" without a version`, start);
    if (/^[<>=!]/.test(version)) return fail(`unexpected "${version}" after the operator "${written}"`, start);
    dependency.version = { operator, version };
    return dependency;
  };

  const parseRich = (depth: number): RpmDependency[] => {
    const start = position;
    position++;
    if (depth > MAX_DEPTH) return fail(`rich dependencies nested more than ${MAX_DEPTH} levels deep`, start);
    const alternatives: RpmDependency[] = [];
    let afterOr = false;
    for (;;) {
      skip(SPACE_RE);
      if (position >= field.length) return fail('unbalanced parentheses', start);
      const char = field[position]!;
      if (char === ')') {
        position++;
        return fail(afterOr ? 'expected a capability after "or"' : 'empty rich dependency', start);
      }
      if (char === '(') alternatives.push(...parseRich(depth + 1));
      else alternatives.push(parseOperand());
      skip(SPACE_RE);
      if (position >= field.length) return fail('unbalanced parentheses', start);
      if (field[position] === ')') {
        position++;
        return alternatives;
      }
      const operatorStart = position;
      const word = take(WORD_RE);
      if (word === '') {
        position++;
        return fail(`unexpected "${field[operatorStart]!}" in a rich dependency`, operatorStart);
      }
      if (UNSUPPORTED_OPERATORS.has(word)) {
        return fail(`the rich dependency operator "${word}" is not supported (only "or")`, start);
      }
      if (word !== 'or') return fail(`expected "or" or ")" but found "${word}"`, operatorStart);
      afterOr = true;
    }
  };

  const groups: DependencyGroup<RpmDependency>[] = [];
  for (;;) {
    skip(SEPARATORS_RE);
    if (position >= field.length) return groups;
    const start = position;
    groups.push(field[position] === '(' ? parseRich(1) : [parseOperand()]);
    if (position < field.length && field[position] !== ',' && !WHITESPACE_RE.test(field[position]!)) {
      position++;
      return fail('unbalanced parentheses', start);
    }
  }
}

function stringifyAlternative(dependency: RpmDependency): string {
  return dependency.version ? `${dependency.name} ${dependency.version.operator} ${dependency.version.version}` : dependency.name;
}

/** @ignore */
export function stringifyRpm(groups: readonly DependencyGroup<RpmDependency>[]): string {
  return groups
    .filter((group) => group.length > 0)
    .map((group) => (group.length === 1 ? stringifyAlternative(group[0]!) : `(${group.map(stringifyAlternative).join(' or ')})`))
    .join(', ');
}
