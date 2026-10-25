/**
 * This file is part of helpers4.
 * Copyright (C) 2026 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * PEP 508 dependency specifications, as in `Requires-Dist`, `requirements.txt` and the
 * `dependencies` of a `pyproject.toml`. Internal implementation of the `'pep508'` format of
 * parseDependencies / stringifyDependencies.
 *
 * Versions are kept as strings and are not validated as PEP 440 beyond being non-empty and free of
 * whitespace, commas, semicolons and parentheses (a `*` is refused after the operators that cannot
 * take a wildcard). Markers are kept as raw text: only their quotes and parentheses must balance.
 */

import type { DependencyConstraint, DependencyGroup, Pep508Dependency, Pep508Operator } from './types';

const NAME_RE = /[A-Za-z0-9](?:[A-Za-z0-9._-]*[A-Za-z0-9])?/y;
const EXTRA_RE = /^[A-Za-z0-9](?:[A-Za-z0-9._-]*[A-Za-z0-9])?$/;
const OPERATOR_RE = /===|~=|==|!=|<=|>=|<|>/y;
const VERSION_RE = /[^\s,;()<>=!~][^\s,;()]*/y;
const URL_RE = /\S+/y;
const SPACE_RE = /\s*/y;

/** The operators that accept a wildcard version (`==1.*`); `===` takes any string. */
const WILDCARD_OPERATORS = new Set<string>(['==', '!=', '===']);

/** Cuts the inline comment: a `#` at the start or after whitespace. */
function stripComment(line: string): string {
  for (let index = 0; index < line.length; index++) {
    if (line[index] === '#' && (index === 0 || /\s/.test(line[index - 1]!))) return line.slice(0, index);
  }
  return line;
}

/** The logical lines of a requirements file: continuations joined, comments and blank lines gone. */
function logicalLines(field: string): string[] {
  const result: string[] = [];
  let pending = '';
  for (const raw of field.split('\n')) {
    const line = raw.endsWith('\r') ? raw.slice(0, -1) : raw;
    if (pending === '' && line.trimStart().startsWith('#')) continue;
    if (line.endsWith('\\')) {
      pending += line.slice(0, -1);
      continue;
    }
    const text = stripComment(pending + line).trim();
    pending = '';
    if (text !== '') result.push(text);
  }
  const rest = stripComment(pending).trim();
  if (rest !== '') result.push(rest);
  return result;
}

/** Checks that the quotes and the parentheses of a marker balance. */
function checkMarker(marker: string, fail: (reason: string) => never): void {
  let quote = '';
  let depth = 0;
  for (const char of marker) {
    if (quote !== '') {
      if (char === quote) quote = '';
    } else if (char === '"' || char === "'") {
      quote = char;
    } else if (char === '(') {
      depth++;
    } else if (char === ')' && --depth < 0) {
      fail('unbalanced ")" in the marker');
    }
  }
  if (quote !== '') fail('unbalanced quote in the marker');
  if (depth > 0) fail('unbalanced "(" in the marker');
}

function parseRequirement(text: string, field: string): Pep508Dependency {
  let position = 0;
  const fail = (reason: string): never => {
    throw new SyntaxError(`parseDependencies: ${reason} in "${text}" (field "${field}")`);
  };
  const take = (pattern: RegExp): RegExpExecArray | null => {
    pattern.lastIndex = position;
    const match = pattern.exec(text);
    if (match) position = pattern.lastIndex;
    return match;
  };
  const skip = (): void => {
    take(SPACE_RE);
  };

  if (text.startsWith('-')) fail('pip options such as "-r" or "--index-url" are not supported');
  const nameMatch = take(NAME_RE);
  if (!nameMatch) return fail('expected a distribution name');
  const dependency: Pep508Dependency = { name: nameMatch[0], extras: [], specifiers: [] };
  skip();

  if (text[position] === '[') {
    const close = text.indexOf(']', position);
    if (close < 0) fail('unclosed "[" in the extras');
    const inner = text.slice(position + 1, close).trim();
    if (inner !== '') {
      for (const part of inner.split(',')) {
        const extra = part.trim();
        if (!EXTRA_RE.test(extra)) fail(`invalid extra "${extra}"`);
        dependency.extras.push(extra);
      }
    }
    position = close + 1;
    skip();
  }

  if (text[position] === '@') {
    position++;
    skip();
    const urlMatch = take(URL_RE);
    if (!urlMatch) return fail('expected a URL after "@"');
    dependency.url = urlMatch[0];
    skip();
  } else if (position < text.length && text[position] !== ';') {
    const parenthesized = text[position] === '(';
    if (parenthesized) {
      position++;
      skip();
    }
    for (;;) {
      const operator = take(OPERATOR_RE)?.[0];
      if (operator === undefined) return fail('expected a version operator');
      skip();
      const version = take(VERSION_RE)?.[0];
      if (version === undefined) return fail(`expected a version after "${operator}"`);
      if (version.includes('*') && !WILDCARD_OPERATORS.has(operator)) fail(`the wildcard "*" is not allowed with "${operator}"`);
      const clause: DependencyConstraint<Pep508Operator> = { operator: operator as Pep508Operator, version };
      dependency.specifiers.push(clause);
      skip();
      if (text[position] !== ',') break;
      position++;
      skip();
    }
    if (parenthesized) {
      if (text[position] !== ')') fail('expected "," or ")" after the version');
      position++;
      skip();
    }
  }

  if (text[position] === ';') {
    const marker = text.slice(position + 1).trim();
    if (marker === '') fail('empty marker after ";"');
    checkMarker(marker, fail);
    dependency.marker = marker;
  } else if (position < text.length) {
    fail(`unexpected "${text.slice(position)}"`);
  }
  return dependency;
}

/**
 * Parses a PEP 508 field: one requirement per line.
 * @ignore
 */
export function parsePep508(field: string): DependencyGroup<Pep508Dependency>[] {
  return logicalLines(field).map((line) => [parseRequirement(line, field)]);
}

function stringifyRequirement(requirement: Pep508Dependency): string {
  let text = requirement.name;
  if (requirement.extras.length > 0) text += `[${requirement.extras.join(',')}]`;
  if (requirement.url !== undefined) {
    if (requirement.specifiers.length > 0) {
      throw new RangeError(`stringifyDependencies: "${requirement.name}" has both a URL and version specifiers`);
    }
    // PEP 508 needs whitespace between the URL and the `;`, or the marker would be read as part of the URL.
    text += ` @ ${requirement.url}`;
    if (requirement.marker !== undefined) text += ' ';
  } else {
    text += requirement.specifiers.map((clause) => `${clause.operator}${clause.version}`).join(',');
  }
  if (requirement.marker !== undefined) text += `; ${requirement.marker}`;
  return text;
}

/** @ignore */
export function stringifyPep508(groups: readonly DependencyGroup<Pep508Dependency>[]): string {
  const lines: string[] = [];
  for (const group of groups) {
    if (group.length > 1) {
      throw new RangeError(`stringifyDependencies: a PEP 508 requirement has no alternatives, got ${group.length}`);
    }
    if (group.length === 1) lines.push(stringifyRequirement(group[0]!));
  }
  return lines.join('\n');
}
