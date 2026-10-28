/**
 * This file is part of helpers4.
 * Copyright (C) 2026 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { transformPath } from './transformPath';
import { translate } from './translate';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'transformPath',
  category: 'geometry',
  examples: [
    {
      title: 'Move a path',
      description: 'Relative commands are made absolute, then every point is transformed.',
      code: `transformPath('M0 0 h10 v10 z', translate(5, 5)) // => 'M5 5 L15 5 L15 15 Z'`,
      assert: () => {
        if (transformPath('M0 0 h10 v10 z', translate(5, 5)) !== 'M5 5 L15 5 L15 15 Z') throw new Error('Unexpected path');
      },
    },
  ],
};

export default examples;
