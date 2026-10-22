/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { buildConventionalCommitRegex } from './buildConventionalCommitRegex';

describe('buildConventionalCommitRegex', () => {
  describe('default options', () => {
    const regex = buildConventionalCommitRegex();

    it('matches a simple type and description', () => {
      expect(regex.test('feat: add login')).toBe(true);
    });

    it('matches a type with scope', () => {
      expect(regex.test('feat(api): add endpoint')).toBe(true);
    });

    it('matches a breaking change marker', () => {
      expect(regex.test('feat(api)!: drop old endpoint')).toBe(true);
      expect(regex.test('feat!: drop old endpoint')).toBe(true);
    });

    it('rejects messages without colon-space separator', () => {
      expect(regex.test('feat:add login')).toBe(false);
      expect(regex.test('feat add login')).toBe(false);
    });

    it('rejects empty descriptions', () => {
      expect(regex.test('feat: ')).toBe(false);
      expect(regex.test('feat:')).toBe(false);
    });

    it('rejects multi-line input (subject only)', () => {
      expect(regex.test('feat: a\nbody')).toBe(false);
    });

    it('captures type, scope, breaking, and description', () => {
      const match = regex.exec('fix(parser)!: handle null');
      expect(match).not.toBeNull();
      expect(match?.[1]).toBe('fix');
      expect(match?.[2]).toBe('parser');
      expect(match?.[3]).toBe('!');
      expect(match?.[4]).toBe('handle null');
    });

    it('leaves scope and breaking groups undefined when absent', () => {
      const match = regex.exec('docs: tweak readme');
      expect(match?.[1]).toBe('docs');
      expect(match?.[2]).toBeUndefined();
      expect(match?.[3]).toBeUndefined();
      expect(match?.[4]).toBe('tweak readme');
    });
  });

  describe('with restricted types', () => {
    const regex = buildConventionalCommitRegex({ types: ['feat', 'fix'] });

    it('accepts allowed types', () => {
      expect(regex.test('feat: x')).toBe(true);
      expect(regex.test('fix: x')).toBe(true);
    });

    it('rejects disallowed types', () => {
      expect(regex.test('chore: x')).toBe(false);
      expect(regex.test('refactor: x')).toBe(false);
    });

    it('escapes regex metacharacters in types', () => {
      const r = buildConventionalCommitRegex({ types: ['feat.x'] });
      expect(r.test('feat.x: ok')).toBe(true);
      expect(r.test('featax: ok')).toBe(false);
    });
  });

  describe('with restricted scopes', () => {
    const regex = buildConventionalCommitRegex({ scopes: ['api', 'core'] });

    it('accepts allowed scopes', () => {
      expect(regex.test('feat(api): x')).toBe(true);
      expect(regex.test('feat(core): x')).toBe(true);
    });

    it('rejects disallowed scopes', () => {
      expect(regex.test('feat(ui): x')).toBe(false);
    });

    it('still allows missing scope when requireScope is false', () => {
      expect(regex.test('feat: x')).toBe(true);
    });
  });

  describe('requireScope', () => {
    const regex = buildConventionalCommitRegex({ requireScope: true });

    it('rejects messages without a scope', () => {
      expect(regex.test('feat: x')).toBe(false);
    });

    it('accepts messages with a scope', () => {
      expect(regex.test('feat(api): x')).toBe(true);
    });
  });

  describe('edge cases', () => {
    it('handles empty types array as default any-letter type', () => {
      const regex = buildConventionalCommitRegex({ types: [] });
      expect(regex.test('chore: x')).toBe(true);
    });

    it('handles empty scopes array as default any scope', () => {
      const regex = buildConventionalCommitRegex({ scopes: [] });
      expect(regex.test('feat(anything): x')).toBe(true);
    });

    it('rejects scopes containing whitespace', () => {
      const regex = buildConventionalCommitRegex();
      expect(regex.test('feat(my scope): x')).toBe(false);
    });
  });
});
