/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { incrementPrerelease } from './incrementPrerelease';

describe('incrementPrerelease', () => {
  it('starts a new prerelease line from a release version', () => {
    expect(incrementPrerelease('1.2.3', 'alpha')).toBe('1.2.4-alpha.0');
  });

  it('increments the counter for the same prerelease type', () => {
    expect(incrementPrerelease('1.2.4-alpha.0', 'alpha')).toBe('1.2.4-alpha.1');
    expect(incrementPrerelease('1.2.4-alpha.9', 'alpha')).toBe('1.2.4-alpha.10');
  });

  it('resets the counter when switching prerelease type', () => {
    expect(incrementPrerelease('1.2.4-alpha.3', 'beta')).toBe('1.2.4-beta.0');
  });

  it('resets the counter for a prerelease with no numeric segment', () => {
    expect(incrementPrerelease('1.2.4-rc', 'rc')).toBe('1.2.4-rc.0');
  });

  it('preserves a leading v prefix', () => {
    expect(incrementPrerelease('v1.2.3', 'alpha')).toBe('v1.2.4-alpha.0');
    expect(incrementPrerelease('v1.2.4-alpha.0', 'alpha')).toBe('v1.2.4-alpha.1');
  });

  it('drops build metadata', () => {
    expect(incrementPrerelease('1.2.4-alpha.0+sha.abc123', 'alpha')).toBe('1.2.4-alpha.1');
    expect(incrementPrerelease('1.2.3+sha.abc123', 'alpha')).toBe('1.2.4-alpha.0');
  });

  it('passes null and undefined through unchanged', () => {
    expect(incrementPrerelease(null, 'alpha')).toBeNull();
    expect(incrementPrerelease(undefined, 'alpha')).toBeUndefined();
  });

  it('ignores extra prerelease segments beyond <type>.<number>', () => {
    expect(incrementPrerelease('1.2.4-alpha.1.extra', 'alpha')).toBe('1.2.4-alpha.2');
  });

  it('resets counter when current prerelease number is non-numeric', () => {
    expect(incrementPrerelease('1.2.4-alpha.abc', 'alpha')).toBe('1.2.4-alpha.0');
  });

  it('resets counter when current prerelease number is empty string', () => {
    expect(incrementPrerelease('1.2.4-alpha.', 'alpha')).toBe('1.2.4-alpha.0');
  });

  describe('gentoo scheme', () => {
    it('defaults to semver when scheme is omitted', () => {
      expect(incrementPrerelease('1.2.3', 'alpha')).toBe('1.2.4-alpha.0');
    });

    it('increments a gentoo prerelease when scheme is "gentoo"', () => {
      expect(incrementPrerelease('1.2.3', 'alpha', 'gentoo')).toBe('1.2.4_alpha');
      expect(incrementPrerelease('1.2.4_alpha', 'alpha', 'gentoo')).toBe('1.2.4_alpha1');
    });

    it('throws for an unrecognized scheme (bypassing the type system)', () => {
      expect(() => incrementPrerelease('1.2.3', 'alpha', 'bogus' as any)).toThrow(/Unhandled version scheme/);
    });
  });
});
