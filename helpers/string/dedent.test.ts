/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { dedent } from './dedent';

describe('dedent', () => {
  it('strips common leading whitespace and trims the leading/trailing blank line', () => {
    const input = '\n      Hello\n        World\n    ';
    expect(dedent(input)).toBe('Hello\n  World');
  });

  it('strips uniform indentation from every line', () => {
    expect(dedent('  a\n  b')).toBe('a\nb');
  });

  it('takes the minimum indentation across lines when they differ', () => {
    expect(dedent('    a\n  b\n      c')).toBe('  a\nb\n    c');
  });

  it('leaves already-unindented text unchanged', () => {
    expect(dedent('a\nb')).toBe('a\nb');
  });

  it('ignores blank lines when computing the minimum indent', () => {
    expect(dedent('  a\n\n  b')).toBe('a\n\nb');
  });

  it('returns an empty string unchanged', () => {
    expect(dedent('')).toBe('');
  });

  it('leaves a residual whitespace-only line as-is when there is no real content to size the indent against', () => {
    // The wrapping blank first/last lines are trimmed, but the middle line has
    // no non-blank sibling to establish a minimum indent from, so minIndent
    // falls back to 0 and the line passes through unchanged.
    expect(dedent('\n   \n')).toBe('   ');
  });

  it('does not touch a single-line string with no blank-line wrapper', () => {
    expect(dedent('  single line')).toBe('single line');
  });

  it('handles tab indentation', () => {
    expect(dedent('\t\ta\n\t\tb')).toBe('a\nb');
  });
});
