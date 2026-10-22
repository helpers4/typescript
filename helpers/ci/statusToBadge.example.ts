/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { statusToBadge } from './statusToBadge';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'statusToBadge',
  category: 'ci',
  examples: [
    {
      title: 'Map CI status to a Markdown badge',
      description: 'Returns a Markdown code-span badge string for the given CI status.',
      code: `statusToBadge('success')  // => '\`passing\`'
statusToBadge('failure')  // => '\`failing\`'
statusToBadge('skipped')  // => '\`skipped\`'
statusToBadge('pending')  // => '\`unknown\`'`,
      assert: () => {
        if (statusToBadge('success') !== '`passing`') throw new Error('Expected `passing`');
        if (statusToBadge('failure') !== '`failing`') throw new Error('Expected `failing`');
      },
    },
  ],
};

export default examples;
