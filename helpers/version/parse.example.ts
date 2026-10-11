/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { parse } from './parse';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'parse',
  category: 'version',
  examples: [
    {
      title: 'Parse a semver string',
      description: 'Breaks a semantic version string into its components.',
      code: `parse('1.2.3')
// => { scheme: 'semver', major: 1, minor: 2, patch: 3, prerelease: [], build: [] }`,
      assert: () => {
        const result = parse('1.2.3');
        if (result.major !== 1 || result.minor !== 2 || result.patch !== 3) throw new Error('Unexpected result');
        if (result.prerelease.length !== 0 || result.build.length !== 0) throw new Error('Expected empty arrays');
      },
    },
    {
      title: 'Parse a prerelease version',
      description: 'Handles prerelease identifiers and optional v prefix.',
      code: `parse('v2.0.0-alpha.1')
// => { scheme: 'semver', major: 2, minor: 0, patch: 0, prerelease: ['alpha', '1'], build: [] }`,
      assert: () => {
        const result = parse('v2.0.0-alpha.1');
        if (result.major !== 2 || result.prerelease[0] !== 'alpha' || result.prerelease[1] !== '1')
          throw new Error('Unexpected result');
      },
    },
    {
      title: 'Parse a Gentoo/Portage ebuild version',
      description: "Pass 'gentoo' as the scheme to parse Gentoo's own version format instead of SemVer.",
      code: `parse('1.2.3b_rc1-r2', 'gentoo')
// => { scheme: 'gentoo', components: [1, 2, 3], letter: 'b', suffixes: [{ type: 'rc', number: 1 }], revision: 2 }`,
      assert: () => {
        const result = parse('1.2.3b_rc1-r2', 'gentoo');
        if (result.components.join('.') !== '1.2.3' || result.letter !== 'b' || result.revision !== 2) throw new Error('Unexpected result');
        if (result.suffixes[0]?.type !== 'rc' || result.suffixes[0]?.number !== 1) throw new Error('Unexpected suffix');
      },
    },
    {
      title: 'Parse a Debian version',
      description: 'Splits epoch, upstream version and Debian revision the way dpkg does.',
      code: `parse('1:2.30~rc1-3ubuntu2', 'debian')
// => { scheme: 'debian', epoch: 1, upstream: '2.30~rc1', revision: '3ubuntu2' }`,
      assert: () => {
        const parsed = parse('1:2.30~rc1-3ubuntu2', 'debian');
        if (parsed.epoch !== 1 || parsed.upstream !== '2.30~rc1' || parsed.revision !== '3ubuntu2') {
          throw new Error(`Unexpected result: ${JSON.stringify(parsed)}`);
        }
      },
    },
  ],
};

export default examples;
