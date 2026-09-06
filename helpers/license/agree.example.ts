/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import type { HelperExamples } from '../../scripts/examples/types';
import { agree } from './agree';

const examples: HelperExamples = {
  helper: 'agree',
  category: 'license',
  examples: [
    {
      title: 'Reconcile notation drift across sources',
      description: 'Two package sources reporting the same real license under different notation.',
      code: `agree('GPL3', 'GPL-3.0-or-later')
// => true`,
      assert: () => {
        if (agree('GPL3', 'GPL-3.0-or-later') !== true) throw new Error('Expected agreement');
      },
    },
    {
      title: 'Flag a real license conflict',
      description: 'Two sources genuinely disagreeing on the license family — a real data-quality signal.',
      code: `agree('BSD-2-Clause', 'Apache-2.0')
// => false`,
      assert: () => {
        if (agree('BSD-2-Clause', 'Apache-2.0') !== false) throw new Error('Expected a conflict');
      },
    },
    {
      title: 'A vague claim is never itself a conflict',
      description: 'When either side is non-informative ("custom", "unknown", ...), there is nothing real to disagree with.',
      code: `agree('custom', 'MIT')
// => true`,
      assert: () => {
        if (agree('custom', 'MIT') !== true) throw new Error('Expected no conflict');
      },
    },
  ],
};

export default examples;
