/**
 * This file is part of helpers4.
 * Copyright (C) 2026 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { isValid } from './isValid';

const core = fc.tuple(fc.nat(999), fc.nat(999), fc.nat(999)).map(([a, b, c]) => `${a}.${b}.${c}`);
const identifier = fc.oneof(fc.nat(99).map(String), fc.stringMatching(/^[A-Za-z-][0-9A-Za-z-]{0,5}$/));
const semver = fc
  .tuple(core, fc.option(fc.array(identifier, { minLength: 1, maxLength: 3 }), { nil: undefined }), fc.option(fc.array(fc.stringMatching(/^[0-9A-Za-z-]{1,6}$/), { minLength: 1, maxLength: 2 }), { nil: undefined }))
  .map(([c, pre, build]) => `${c}${pre ? `-${pre.join('.')}` : ''}${build ? `+${build.join('.')}` : ''}`);

describe('isValid — property-based', () => {
  it('accepts every well-formed SemVer string', () => {
    fc.assert(fc.property(semver, (version) => { expect(isValid(version)).toBe(true); }));
  });

  it('refuses a v prefix on any valid version', () => {
    fc.assert(fc.property(semver, (version) => { expect(isValid(`v${version}`)).toBe(false); }));
  });

  it('never throws on any input, in any scheme', () => {
    const scheme = fc.constantFrom('semver', 'gentoo', 'debian', 'rpm', 'pacman', 'pep440', 'maven' as const);
    fc.assert(fc.property(fc.anything(), scheme, (value, s) => { expect(typeof isValid(value, s as never)).toBe('boolean'); }));
  });
});
