/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { compareGentoo, incrementGentoo, incrementPrereleaseGentoo, parseGentoo, satisfiesRangeGentoo, stringifyGentoo } from './_gentoo';

describe('parseGentoo', () => {
  it('parses a bare numeric version', () => {
    expect(parseGentoo('1.2.3')).toEqual({ scheme: 'gentoo', components: [1, 2, 3], letter: '', suffixes: [], revision: 0 });
  });

  it('parses a single-component version', () => {
    expect(parseGentoo('5')).toEqual({ scheme: 'gentoo', components: [5], letter: '', suffixes: [], revision: 0 });
  });

  it('parses an arbitrary number of components', () => {
    expect(parseGentoo('1.2.3.4.5')).toEqual({ scheme: 'gentoo', components: [1, 2, 3, 4, 5], letter: '', suffixes: [], revision: 0 });
  });

  it('parses a letter suffix', () => {
    expect(parseGentoo('1.2.3b')).toEqual({ scheme: 'gentoo', components: [1, 2, 3], letter: 'b', suffixes: [], revision: 0 });
  });

  it('parses a suffix with a number', () => {
    expect(parseGentoo('1.2.3_rc1')).toEqual({
      scheme: 'gentoo',
      components: [1, 2, 3],
      letter: '',
      suffixes: [{ type: 'rc', number: 1 }],
      revision: 0,
    });
  });

  it('parses a bare suffix with no trailing digits as number 0', () => {
    expect(parseGentoo('1.2.3_beta')).toEqual({
      scheme: 'gentoo',
      components: [1, 2, 3],
      letter: '',
      suffixes: [{ type: 'beta', number: 0 }],
      revision: 0,
    });
  });

  it('parses each suffix type', () => {
    for (const type of ['alpha', 'beta', 'pre', 'rc', 'p'] as const) {
      expect(parseGentoo(`1.0.0_${type}1`).suffixes).toEqual([{ type, number: 1 }]);
    }
  });

  it('parses a revision', () => {
    expect(parseGentoo('1.2.3-r2')).toEqual({ scheme: 'gentoo', components: [1, 2, 3], letter: '', suffixes: [], revision: 2 });
  });

  it('parses letter + suffix + revision together', () => {
    expect(parseGentoo('1.2.3b_rc1-r2')).toEqual({
      scheme: 'gentoo',
      components: [1, 2, 3],
      letter: 'b',
      suffixes: [{ type: 'rc', number: 1 }],
      revision: 2,
    });
  });

  it('parses chained suffixes in order', () => {
    expect(parseGentoo('1.0.0_alpha1_rc2').suffixes).toEqual([
      { type: 'alpha', number: 1 },
      { type: 'rc', number: 2 },
    ]);
  });

  it('throws a SyntaxError for an unparseable version', () => {
    expect(() => parseGentoo('not-a-version')).toThrow(SyntaxError);
  });

  it('throws for a SemVer-style prerelease (dash-alpha, not underscore)', () => {
    expect(() => parseGentoo('1.2.3-alpha.1')).toThrow(SyntaxError);
  });

  it('resets the global suffix regex lastIndex between calls (regression)', () => {
    // A stateful global regex whose lastIndex isn't reset would skip matches on a
    // subsequent call if a previous call's match ended partway through the string.
    expect(parseGentoo('1.0.0_alpha1').suffixes).toEqual([{ type: 'alpha', number: 1 }]);
    expect(parseGentoo('2.0.0_beta2').suffixes).toEqual([{ type: 'beta', number: 2 }]);
  });
});

describe('compareGentoo', () => {
  it('compares numeric components', () => {
    expect(compareGentoo('1.2.3', '1.2.4')).toBe(-1);
    expect(compareGentoo('1.3.0', '1.2.9')).toBe(1);
    expect(compareGentoo('1.2.3', '1.2.3')).toBe(0);
  });

  it('compares components of different lengths, missing ones treated as 0', () => {
    expect(compareGentoo('1.2', '1.2.0')).toBe(0);
    expect(compareGentoo('1.2', '1.2.1')).toBe(-1);
    expect(compareGentoo('1.2.1', '1.2')).toBe(1);
  });

  it('compares the letter suffix', () => {
    expect(compareGentoo('1.2.3a', '1.2.3b')).toBe(-1);
    expect(compareGentoo('1.2.3', '1.2.3a')).toBe(-1);
    expect(compareGentoo('1.2.3b', '1.2.3a')).toBe(1);
  });

  it('a revision sorts above its base version — unlike SemVer prerelease', () => {
    expect(compareGentoo('1.2.3', '1.2.3-r1')).toBe(-1);
    expect(compareGentoo('1.2.3-r1', '1.2.3')).toBe(1);
  });

  it('compares revisions numerically', () => {
    expect(compareGentoo('1.2.3-r1', '1.2.3-r2')).toBe(-1);
    expect(compareGentoo('1.2.3-r10', '1.2.3-r2')).toBe(1);
    expect(compareGentoo('1.2.3-r1', '1.2.3-r1')).toBe(0);
  });

  it('alpha/beta/pre/rc sort below the plain release', () => {
    expect(compareGentoo('1.2.3_alpha1', '1.2.3')).toBe(-1);
    expect(compareGentoo('1.2.3_rc1', '1.2.3')).toBe(-1);
  });

  it('p sorts above the plain release', () => {
    expect(compareGentoo('1.2.3_p1', '1.2.3')).toBe(1);
  });

  it('orders suffix types alpha < beta < pre < rc < release < p', () => {
    const ordered = ['1.0.0_alpha1', '1.0.0_beta1', '1.0.0_pre1', '1.0.0_rc1', '1.0.0', '1.0.0_p1'];
    for (let i = 0; i < ordered.length - 1; i++) {
      expect(compareGentoo(ordered[i], ordered[i + 1])).toBe(-1);
    }
  });

  it('compares suffix numbers within the same suffix type', () => {
    expect(compareGentoo('1.0.0_rc1', '1.0.0_rc2')).toBe(-1);
    expect(compareGentoo('1.0.0_rc2', '1.0.0_rc1')).toBe(1);
    expect(compareGentoo('1.0.0_rc1', '1.0.0_rc1')).toBe(0);
  });

  it('for chained suffixes, only the last one determines precedence', () => {
    // Both end in _rc — precedence should match regardless of the earlier chained segment.
    expect(compareGentoo('1.0.0_alpha1_rc1', '1.0.0_rc1')).toBe(0);
  });
});

describe('stringifyGentoo', () => {
  it('reconstructs a bare numeric version', () => {
    expect(stringifyGentoo({ scheme: 'gentoo', components: [1, 2, 3], letter: '', suffixes: [], revision: 0 })).toBe('1.2.3');
  });

  it('reconstructs a letter suffix', () => {
    expect(stringifyGentoo({ scheme: 'gentoo', components: [1, 2, 3], letter: 'b', suffixes: [], revision: 0 })).toBe('1.2.3b');
  });

  it('reconstructs a suffix with a number', () => {
    expect(stringifyGentoo({ scheme: 'gentoo', components: [1, 2, 3], letter: '', suffixes: [{ type: 'rc', number: 1 }], revision: 0 })).toBe(
      '1.2.3_rc1',
    );
  });

  it('reconstructs a bare suffix (number 0) without trailing digits', () => {
    expect(
      stringifyGentoo({ scheme: 'gentoo', components: [1, 2, 3], letter: '', suffixes: [{ type: 'beta', number: 0 }], revision: 0 }),
    ).toBe('1.2.3_beta');
  });

  it('reconstructs a revision', () => {
    expect(stringifyGentoo({ scheme: 'gentoo', components: [1, 2, 3], letter: '', suffixes: [], revision: 2 })).toBe('1.2.3-r2');
  });

  it('reconstructs letter + suffix + revision together', () => {
    expect(
      stringifyGentoo({ scheme: 'gentoo', components: [1, 2, 3], letter: 'b', suffixes: [{ type: 'rc', number: 1 }], revision: 2 }),
    ).toBe('1.2.3b_rc1-r2');
  });

  it('round-trips through parseGentoo for canonical strings', () => {
    for (const v of ['1.2.3', '1.2.3b', '1.2.3_rc1', '1.2.3-r2', '1.2.3b_rc1-r2', '5', '1.2.3.4.5']) {
      expect(stringifyGentoo(parseGentoo(v))).toBe(v);
    }
  });
});

describe('incrementGentoo', () => {
  it('bumps patch (3rd component), leaving major/minor alone', () => {
    expect(incrementGentoo('1.2.3', 'patch')).toBe('1.2.4');
  });

  it('bumps minor and resets patch', () => {
    expect(incrementGentoo('1.2.3', 'minor')).toBe('1.3.0');
  });

  it('bumps major and resets minor and patch', () => {
    expect(incrementGentoo('1.2.3', 'major')).toBe('2.0.0');
  });

  it('resets components after the bumped one, even beyond the first three', () => {
    expect(incrementGentoo('1.2.3.4', 'minor')).toBe('1.3.0.0');
  });

  it('pads missing components before bumping', () => {
    expect(incrementGentoo('1', 'minor')).toBe('1.1.0');
    expect(incrementGentoo('1.2', 'patch')).toBe('1.2.1');
  });

  it('drops the letter, suffixes, and revision', () => {
    expect(incrementGentoo('1.2.3b_rc1-r2', 'patch')).toBe('1.2.4');
  });

  it('throws for an invalid increment type (bypassing the type system)', () => {
    expect(() => incrementGentoo('1.2.3', 'invalid' as any)).toThrow(/Invalid increment type/);
  });
});

describe('incrementPrereleaseGentoo', () => {
  it('starts a new prerelease line when there is no current suffix', () => {
    expect(incrementPrereleaseGentoo('1.2.3', 'alpha')).toBe('1.2.4_alpha');
  });

  it('increments the counter for the same suffix type', () => {
    expect(incrementPrereleaseGentoo('1.2.3_alpha1', 'alpha')).toBe('1.2.3_alpha2');
  });

  it('resets the counter to 0 for a different suffix type', () => {
    expect(incrementPrereleaseGentoo('1.2.3_alpha1', 'beta')).toBe('1.2.3_beta');
  });

  it('treats a plain release with only a revision as "no current prerelease"', () => {
    expect(incrementPrereleaseGentoo('1.2.3-r5', 'rc')).toBe('1.2.4_rc');
  });

  it('treats a p suffix as "no current prerelease" (p is not a prerelease)', () => {
    expect(incrementPrereleaseGentoo('1.2.3_p1', 'alpha')).toBe('1.2.4_alpha');
  });

  it('preserves the letter suffix', () => {
    expect(incrementPrereleaseGentoo('1.2.3b_alpha1', 'alpha')).toBe('1.2.3b_alpha2');
  });

  it('throws for a prerelease id outside the fixed Gentoo suffix vocabulary', () => {
    expect(() => incrementPrereleaseGentoo('1.2.3', 'next')).toThrow(/not a valid Gentoo suffix type/);
  });
});

describe('satisfiesRangeGentoo', () => {
  it('exact match', () => {
    expect(satisfiesRangeGentoo('1.2.3', '1.2.3')).toBe(true);
    expect(satisfiesRangeGentoo('1.2.3', '1.2.4')).toBe(false);
  });

  it('treats a bare version and an explicit -r0 as the same exact match', () => {
    expect(satisfiesRangeGentoo('1.2.3-r0', '1.2.3')).toBe(true);
    expect(satisfiesRangeGentoo('1.2.3-r1', '1.2.3')).toBe(false);
  });

  it('>= operator', () => {
    expect(satisfiesRangeGentoo('1.2.3', '>=1.2.0')).toBe(true);
    expect(satisfiesRangeGentoo('1.2.3', '>=1.2.3')).toBe(true);
    expect(satisfiesRangeGentoo('1.2.3', '>=1.3.0')).toBe(false);
  });

  it('> operator', () => {
    expect(satisfiesRangeGentoo('1.2.3', '>1.2.0')).toBe(true);
    expect(satisfiesRangeGentoo('1.2.3', '>1.2.3')).toBe(false);
  });

  it('<= operator', () => {
    expect(satisfiesRangeGentoo('1.2.3', '<=1.2.3')).toBe(true);
    expect(satisfiesRangeGentoo('1.2.3', '<=1.2.0')).toBe(false);
  });

  it('< operator', () => {
    expect(satisfiesRangeGentoo('1.2.3', '<1.3.0')).toBe(true);
    expect(satisfiesRangeGentoo('1.2.3', '<1.2.3')).toBe(false);
  });

  it('throws for ^ and ~ — no Gentoo/Portage equivalent', () => {
    expect(() => satisfiesRangeGentoo('1.2.3', '^1.0.0')).toThrow(/no Gentoo\/Portage equivalent/);
    expect(() => satisfiesRangeGentoo('1.2.3', '~1.2.0')).toThrow(/no Gentoo\/Portage equivalent/);
  });

  it('an operator character with no valid prefix is an unsupported range format', () => {
    // '=' alone is not '>=', '<=', or an exact match (no operator character at all)
    expect(satisfiesRangeGentoo('1.2.3', '=1.2.3')).toBe(false);
  });
});
