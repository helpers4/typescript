/**
 * This file is part of helpers4.
 * Copyright (C) 2026 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { parsePath } from './parsePath';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'parsePath',
  category: 'geometry',
  examples: [
    {
      title: 'Read path data',
      description: 'Letters keep their case; a repeated command becomes one command per set of numbers.',
      code: `parsePath('M0 0h10v10z').map((c) => c.type) // => ['M', 'h', 'v', 'z']`,
      assert: () => {
        if (parsePath('M0 0h10v10z').map((c) => c.type).join('') !== 'Mhvz') throw new Error('Expected M h v z');
      },
    },
  ],
};

export default examples;
