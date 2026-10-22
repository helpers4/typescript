/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import type { HelperExamples } from '../../scripts/examples/types';
import { isKnown } from './isKnown';

const examples: HelperExamples = {
  helper: 'isKnown',
  category: 'license',
  examples: [
    {
      title: 'Filter out entries with no real license information',
      description: 'Handy for flagging catalog entries whose license field is not actually usable.',
      code: `['MIT', 'custom:Acme EULA', 'unknown'].filter(isKnown)
// => ['MIT']`,
      assert: () => {
        const result = ['MIT', 'custom:Acme EULA', 'unknown'].filter(isKnown);
        if (result.length !== 1 || result[0] !== 'MIT') throw new Error('Unexpected filter result');
      },
    },
    {
      title: 'A vendor-specific EULA is not a recognized family',
      description: '"custom:<vendor>" names the vendor\'s own license text, not a known open-source family.',
      code: `isKnown('custom:Acme End User License')
// => false`,
      assert: () => {
        if (isKnown('custom:Acme End User License') !== false) throw new Error('Expected false');
      },
    },
  ],
};

export default examples;
