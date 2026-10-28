/**
 * This file is part of helpers4.
 * Copyright (C) 2026 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { matchGlob } from './matchGlob';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'matchGlob',
  category: 'string',
  examples: [
    {
      title: 'Test a name against a glob',
      description: 'One call, with an option to ignore case.',
      code: `matchGlob('screen *', 'Screen 2', { caseInsensitive: true }) // => true`,
      assert: () => {
        if (!matchGlob('screen *', 'Screen 2', { caseInsensitive: true })) throw new Error('Expected a match');
      },
    },
  ],
};

export default examples;
