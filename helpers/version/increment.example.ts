/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { increment } from './increment';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'increment',
  category: 'version',
  examples: [
    {
      title: 'Increment the patch version',
      description: 'Bumps the patch number while keeping major and minor.',
      code: `increment('1.2.3', 'patch')
// => '1.2.4'`,
      assert: () => {
        if (increment('1.2.3', 'patch') !== '1.2.4') throw new Error('Unexpected result');
      },
    },
    {
      title: 'Increment the minor version',
      description: 'Bumps the minor number and resets patch to 0.',
      code: `increment('1.2.3', 'minor')
// => '1.3.0'`,
      assert: () => {
        if (increment('1.2.3', 'minor') !== '1.3.0') throw new Error('Unexpected result');
      },
    },
    {
      title: 'Preserve the v prefix',
      description: 'The v prefix is preserved if present in the input.',
      code: `increment('v1.0.0', 'major')
// => 'v2.0.0'`,
      assert: () => {
        if (increment('v1.0.0', 'major') !== 'v2.0.0') throw new Error('Unexpected result');
      },
    },
  ],
};

export default examples;
