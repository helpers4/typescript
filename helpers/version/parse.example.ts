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
// => { major: 1, minor: 2, patch: 3, prerelease: [], build: [] }`,
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
// => { major: 2, minor: 0, patch: 0, prerelease: ['alpha', '1'], build: [] }`,
      assert: () => {
        const result = parse('v2.0.0-alpha.1');
        if (result.major !== 2 || result.prerelease[0] !== 'alpha' || result.prerelease[1] !== '1')
          throw new Error('Unexpected result');
      },
    },
  ],
};

export default examples;
