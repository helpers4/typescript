/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { parseConventionalCommit } from './parseConventionalCommit';

describe('parseConventionalCommit', () => {
  describe('subject line', () => {
    it('parses type and description', () => {
      expect(parseConventionalCommit('feat: add login')).toEqual({
        type: 'feat',
        scope: null,
        breaking: false,
        description: 'add login',
        body: '',
        footer: '',
      });
    });

    it('parses type, scope, and description', () => {
      const result = parseConventionalCommit('feat(api): add endpoint');
      expect(result?.type).toBe('feat');
      expect(result?.scope).toBe('api');
      expect(result?.description).toBe('add endpoint');
    });

    it('detects breaking marker', () => {
      const result = parseConventionalCommit('feat(api)!: drop v1');
      expect(result?.breaking).toBe(true);
    });

    it('returns null on a non-conventional subject', () => {
      expect(parseConventionalCommit('hello world')).toBeNull();
      expect(parseConventionalCommit('')).toBeNull();
    });

    it('returns null when message is not a string', () => {
      // @ts-expect-error testing runtime guard
      expect(parseConventionalCommit(undefined)).toBeNull();
      // @ts-expect-error testing runtime guard
      expect(parseConventionalCommit(null)).toBeNull();
      // @ts-expect-error testing runtime guard
      expect(parseConventionalCommit(42)).toBeNull();
    });
  });

  describe('body and footer', () => {
    it('extracts a body without footer', () => {
      const message = 'feat: x\n\nDetailed body here';
      const result = parseConventionalCommit(message);
      expect(result?.body).toBe('Detailed body here');
      expect(result?.footer).toBe('');
    });

    it('extracts a footer-only message', () => {
      const message = 'feat: x\n\nRefs: #1\nReviewed-by: alice';
      const result = parseConventionalCommit(message);
      expect(result?.body).toBe('');
      expect(result?.footer).toBe('Refs: #1\nReviewed-by: alice');
    });

    it('separates body from footer', () => {
      const message = 'feat: x\n\nBody paragraph.\n\nRefs: #1';
      const result = parseConventionalCommit(message);
      expect(result?.body).toBe('Body paragraph.');
      expect(result?.footer).toBe('Refs: #1');
    });

    it('keeps multi-paragraph body intact', () => {
      const message = 'feat: x\n\nFirst.\n\nSecond.\n\nRefs: #1';
      const result = parseConventionalCommit(message);
      expect(result?.body).toBe('First.\n\nSecond.');
      expect(result?.footer).toBe('Refs: #1');
    });

    it('treats trailing block as body when not all lines are footer tokens', () => {
      const message = 'feat: x\n\nMostly text\nRefs: #1';
      const result = parseConventionalCommit(message);
      expect(result?.footer).toBe('');
      expect(result?.body).toBe('Mostly text\nRefs: #1');
    });
  });

  describe('BREAKING CHANGE detection', () => {
    it('detects BREAKING CHANGE in footer', () => {
      const message = 'feat: x\n\nBREAKING CHANGE: drops old API';
      expect(parseConventionalCommit(message)?.breaking).toBe(true);
    });

    it('detects BREAKING-CHANGE (hyphen variant) in footer', () => {
      const message = 'feat: x\n\nBREAKING-CHANGE: drops old API';
      expect(parseConventionalCommit(message)?.breaking).toBe(true);
    });

    it('honours both `!` and footer when both are present', () => {
      const message = 'feat!: x\n\nBREAKING CHANGE: drops old API';
      expect(parseConventionalCommit(message)?.breaking).toBe(true);
    });

    it('does not flag breaking when neither marker nor footer is present', () => {
      expect(parseConventionalCommit('feat: x\n\njust details')?.breaking).toBe(false);
    });
  });

  describe('input normalisation', () => {
    it('handles CRLF line endings', () => {
      const message = 'feat: x\r\n\r\nbody';
      expect(parseConventionalCommit(message)?.body).toBe('body');
    });

    it('strips leading and trailing blank lines', () => {
      const message = 'feat: x\n\n\nbody\n\n';
      expect(parseConventionalCommit(message)?.body).toBe('body');
    });
  });

  describe('with options', () => {
    it('forwards type/scope/requireScope to the regex builder', () => {
      const ok = parseConventionalCommit('feat(api): x', { types: ['feat'], scopes: ['api'], requireScope: true });
      expect(ok).not.toBeNull();

      const wrongType = parseConventionalCommit('chore(api): x', { types: ['feat'] });
      expect(wrongType).toBeNull();

      const missingScope = parseConventionalCommit('feat: x', { requireScope: true });
      expect(missingScope).toBeNull();
    });
  });
});
