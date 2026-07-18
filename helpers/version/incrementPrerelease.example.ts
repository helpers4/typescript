/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { incrementPrerelease } from './incrementPrerelease';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'incrementPrerelease',
  category: 'version',
  examples: [
    {
      title: 'Start a new alpha line',
      description: 'Bumping a release version starts a fresh prerelease at .0, one patch ahead.',
      code: `incrementPrerelease('1.2.3', 'alpha')
// => '1.2.4-alpha.0'`,
      assert: () => {
        if (incrementPrerelease('1.2.3', 'alpha') !== '1.2.4-alpha.0') throw new Error('Expected 1.2.4-alpha.0');
      },
    },
    {
      title: 'Increment the same prerelease type',
      description: 'Bumping with the same prereleaseId increments its counter.',
      code: `incrementPrerelease('1.2.4-alpha.0', 'alpha')
// => '1.2.4-alpha.1'`,
      assert: () => {
        if (incrementPrerelease('1.2.4-alpha.0', 'alpha') !== '1.2.4-alpha.1') {
          throw new Error('Expected 1.2.4-alpha.1');
        }
      },
    },
    {
      title: 'Switch prerelease type',
      description: 'Switching to a different prereleaseId resets the counter to 0, e.g. graduating from alpha to beta.',
      code: `incrementPrerelease('1.2.4-alpha.3', 'beta')
// => '1.2.4-beta.0'`,
      assert: () => {
        if (incrementPrerelease('1.2.4-alpha.3', 'beta') !== '1.2.4-beta.0') {
          throw new Error('Expected 1.2.4-beta.0');
        }
      },
    },
  ],
};

export default examples;
