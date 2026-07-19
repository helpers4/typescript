/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { normalizeChangelogSpacing, stripLeadingArgSeparator } from './generate-changelog';

describe('stripLeadingArgSeparator', () => {
  it('strips a leading -- (npm/pnpm run -- args separator)', () => {
    // Regression test for the v3.0.2 release failure: `pnpm run changelog -- --tag v3.0.2`
    // forwards a literal leading `--` into argv, which git-cliff then reads as its own
    // end-of-options marker — turning `--tag`/`v3.0.2` into unexpected positional args.
    expect(stripLeadingArgSeparator(['--', '--tag', 'v3.0.2'])).toEqual(['--tag', 'v3.0.2']);
  });

  it('leaves args untouched when there is no leading --', () => {
    expect(stripLeadingArgSeparator(['--tag', 'v3.0.2'])).toEqual(['--tag', 'v3.0.2']);
  });

  it('only strips a leading --, not one appearing later', () => {
    expect(stripLeadingArgSeparator(['--tag', '--', 'v3.0.2'])).toEqual(['--tag', '--', 'v3.0.2']);
  });

  it('returns an empty array unchanged', () => {
    expect(stripLeadingArgSeparator([])).toEqual([]);
  });
});

describe('normalizeChangelogSpacing', () => {
  it('inserts a blank line before each release heading', () => {
    // git-cliff's raw template output has no blank line between sections
    const input = '# Changelog\n## [1.0.0]\ncontent\n## [0.9.0]\nmore';
    expect(normalizeChangelogSpacing(input)).toBe('# Changelog\n\n## [1.0.0]\ncontent\n\n## [0.9.0]\nmore');
  });

  it('does not leave a leading blank line when the file starts with a heading', () => {
    expect(normalizeChangelogSpacing('## [1.0.0]\ncontent')).toBe('## [1.0.0]\ncontent');
  });
});
