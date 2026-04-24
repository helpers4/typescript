/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { parse } from './parse';
import { stringify } from './stringify';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'stringify',
  category: 'version',
  examples: [
    {
      title: 'Reconstruct a stable version',
      description: 'Converts a ParsedVersion object back to a version string.',
      code: `stringify({ major: 1, minor: 2, patch: 3, prerelease: [], build: [] })
// => '1.2.3'`,
      assert: () => {
        const result = stringify({ major: 1, minor: 2, patch: 3, prerelease: [], build: [] });
        if (result !== '1.2.3') throw new Error(`Unexpected: ${result}`);
      },
    },
    {
      title: 'Round-trip with parse',
      description: 'stringify(parse(v)) returns the original version string (without leading v).',
      code: `stringify(parse('2.0.0-alpha.1'))
// => '2.0.0-alpha.1'

stringify(parse('1.0.0-beta+exp.sha.5114f85'))
// => '1.0.0-beta+exp.sha.5114f85'`,
      assert: () => {
        if (stringify(parse('2.0.0-alpha.1')) !== '2.0.0-alpha.1') throw new Error('Round-trip failed');
        if (stringify(parse('1.0.0-beta+exp.sha.5114f85')) !== '1.0.0-beta+exp.sha.5114f85') throw new Error('Round-trip failed');
      },
    },
  ],
};

export default examples;
