/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { createMatcher } from './createMatcher';

describe('createMatcher', () => {
  describe('string patterns, auto syntax', () => {
    it('reads a glob', () => {
      const matches = createMatcher('Button*');
      expect(matches('Button / Primary')).toBe(true);
      expect(matches('button')).toBe(false);
      expect(createMatcher('Button*', { caseSensitive: false })('button')).toBe(true);
    });

    it('reads /source/flags as a regular expression, with its own flags', () => {
      expect(createMatcher('/^icon-\\d+$/i')('Icon-42')).toBe(true);
      expect(createMatcher('/^icon$/')('Icon')).toBe(false);
      expect(createMatcher('/^icon$/', { caseSensitive: false })('Icon')).toBe(false);
      expect(createMatcher('/a\\/b/')('a/b')).toBe(true);
    });

    it('reads paths with non-flag letters, or without a closing slash, as globs', () => {
      expect(createMatcher('/src/index')('/src/index')).toBe(true);
      expect(createMatcher('/src/*.ts')('/src/a.ts')).toBe(true);
      expect(createMatcher('/a/I')('/a/I')).toBe(true);
      expect(createMatcher('/')('/')).toBe(true);
      expect(createMatcher('//')('//')).toBe(true);
    });

    it('throws a SyntaxError for an invalid regular expression or repeated flags', () => {
      expect(() => createMatcher('/(/')).toThrow(SyntaxError);
      expect(() => createMatcher('/a/gg')).toThrow(/invalid regular expression "\/a\/gg"/);
    });
  });

  describe('syntax option', () => {
    it("'glob' never reads a regular expression", () => {
      expect(createMatcher('/usr/lib/img', { syntax: 'glob' })('/usr/lib/img')).toBe(true);
    });

    it("'regex' reads the whole string as a source", () => {
      expect(createMatcher('^(Home|Login)$', { syntax: 'regex' })('Login')).toBe(true);
      expect(createMatcher('^home$', { syntax: 'regex', caseSensitive: false })('Home')).toBe(true);
      expect(createMatcher('^home$', { syntax: 'regex' })('Home')).toBe(false);
      expect(() => createMatcher('(', { syntax: 'regex' })).toThrow(SyntaxError);
    });
  });

  describe('RegExp and function patterns', () => {
    it('uses a RegExp, without the state of g and y', () => {
      const matches = createMatcher(/a/g);
      expect(matches('a')).toBe(true);
      expect(matches('a')).toBe(true);
      expect(createMatcher(/^a/y)('a')).toBe(true);
      const plain = /b/i;
      expect(createMatcher(plain)('B')).toBe(true);
    });

    it('calls a function as is', () => {
      expect(createMatcher((text) => text.length > 3)('long')).toBe(true);
    });
  });

  describe('explicit re: and glob: prefixes', () => {
    it('re: reads the rest as a regular expression, whatever the syntax option', () => {
      expect(createMatcher('re:^v\\d+$')('v12')).toBe(true);
      expect(createMatcher('re:^v\\d+$', { syntax: 'glob' })('v12')).toBe(true);
      expect(createMatcher('re:^v$', { caseSensitive: false })('V')).toBe(true);
    });

    it('glob: reads the rest as a glob, even when it looks like /source/flags', () => {
      expect(createMatcher('glob:/a/')('/a/')).toBe(true);
      expect(createMatcher('glob:/a/', { syntax: 'regex' })('/a/')).toBe(true);
      expect(createMatcher('glob:*.ts')('a.ts')).toBe(true);
    });

    it('mixes readings in one array, with exclusions', () => {
      const matches = createMatcher(['glob:src/*', 're:\\.tsx?$', '!re:test']);
      expect(matches('src/a.md')).toBe(true);
      expect(matches('lib/b.ts')).toBe(true);
      expect(matches('lib/b.test.ts')).toBe(false);
    });

    it('glob:re: matches a string that really starts with re:', () => {
      expect(createMatcher('glob:re:*')('re:x')).toBe(true);
    });

    it('throws on an invalid re: pattern', () => {
      expect(() => createMatcher('re:(')).toThrow(SyntaxError);
    });
  });

  describe('extended globs', () => {
    it('turns on braces, classes and path-aware wildcards', () => {
      const matches = createMatcher('src/**/*.{ts,tsx}', { extended: true });
      expect(matches('src/ui/App.tsx')).toBe(true);
      expect(matches('src/a.ts')).toBe(true);
      expect(matches('src/a.js')).toBe(false);
      expect(createMatcher('src/*.ts')('src/ui/a.ts')).toBe(true);
      expect(createMatcher('src/*.ts', { extended: true })('src/ui/a.ts')).toBe(false);
    });
  });

  describe('arrays', () => {
    it('matches when any pattern matches', () => {
      const matches = createMatcher(['*.fig', /\.sketch$/, (text) => text === 'x']);
      expect(matches('a.fig')).toBe(true);
      expect(matches('b.sketch')).toBe(true);
      expect(matches('x')).toBe(true);
      expect(matches('c.xd')).toBe(false);
    });

    it('excludes strings starting with !, whatever their position', () => {
      const matches = createMatcher(['!draft-*', '*.fig']);
      expect(matches('a.fig')).toBe(true);
      expect(matches('draft-a.fig')).toBe(false);
      expect(createMatcher(['!/^tmp/i'])('TMP-1')).toBe(false);
    });

    it('with only exclusions, matches everything else; empty matches everything', () => {
      const matches = createMatcher(['!*.tmp']);
      expect(matches('a.fig')).toBe(true);
      expect(matches('a.tmp')).toBe(false);
      expect(createMatcher([])('anything')).toBe(true);
    });

    it('\\! is a literal leading !', () => {
      const matches = createMatcher(['\\!important']);
      expect(matches('!important')).toBe(true);
      expect(matches('important')).toBe(false);
    });

    it('a leading ! outside an array is literal', () => {
      expect(createMatcher('!a')('!a')).toBe(true);
    });

    it('throws when one entry is invalid', () => {
      expect(() => createMatcher(['*.fig', '/(/'])).toThrow(SyntaxError);
      expect(() => createMatcher(['!/(/'])).toThrow(SyntaxError);
    });
  });
});
