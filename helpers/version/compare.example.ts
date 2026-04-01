/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { compare } from './compare';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'compare',
  category: 'version',
  examples: [
    {
      title: 'Compare two semver versions',
      description: 'Returns -1, 0, or 1 based on SemVer ordering.',
      code: `compare('1.0.0', '2.0.0') // => -1
compare('1.0.0', '1.0.0') // => 0
compare('2.0.0', '1.0.0') // => 1`,
      assert: () => {
        if (compare('1.0.0', '2.0.0') !== -1) throw new Error('Expected -1');
        if (compare('1.0.0', '1.0.0') !== 0) throw new Error('Expected 0');
        if (compare('2.0.0', '1.0.0') !== 1) throw new Error('Expected 1');
      },
    },
    {
      title: 'Prerelease is lower than release',
      description: 'A prerelease version is always less than the release.',
      code: `compare('1.0.0-alpha', '1.0.0')
// => -1`,
      assert: () => {
        if (compare('1.0.0-alpha', '1.0.0') !== -1) throw new Error('Expected -1');
      },
    },
  ],
};

export default examples;
