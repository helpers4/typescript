/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { statusToIcon } from './statusToIcon';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'statusToIcon',
  category: 'ci',
  examples: [
    {
      title: 'Map CI status to icon',
      description: 'Returns an emoji icon matching the given CI status.',
      code: `statusToIcon('success')  // => '✅'
statusToIcon('failure')  // => '❌'
statusToIcon('skipped')  // => '⏭️'
statusToIcon('pending')  // => '⚠️'`,
      assert: () => {
        if (statusToIcon('success') !== '✅') throw new Error('Expected ✅');
        if (statusToIcon('failure') !== '❌') throw new Error('Expected ❌');
        if (statusToIcon('skipped') !== '⏭️') throw new Error('Expected ⏭️');
        if (statusToIcon('pending') !== '⚠️') throw new Error('Expected ⚠️');
      },
    },
  ],
};

export default examples;
