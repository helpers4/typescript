/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import type { HelperExamples } from '../../scripts/examples/types';
import { families } from './families';

const examples: HelperExamples = {
  helper: 'families',
  category: 'license',
  examples: [
    {
      title: 'Collapse notation drift into one family',
      description: '"GPL3" and "GPL-3.0-or-later" are the same real license, reported differently by two sources.',
      code: `families('GPL3')
// => Set(1) { 'gpl' }`,
      assert: () => {
        if (!(families('GPL3').size === 1 && families('GPL3').has('gpl'))) throw new Error('Unexpected family');
      },
    },
    {
      title: 'Split a compound SPDX expression',
      description: '"AND"/"OR" (any case) separate multiple license claims; "WITH" exception clauses are dropped.',
      code: `families('GPL-3.0-or-later AND LGPL-3.0-or-later')
// => Set(2) { 'gpl', 'lgpl' }`,
      assert: () => {
        const result = families('GPL-3.0-or-later AND LGPL-3.0-or-later');
        if (result.size !== 2 || !result.has('gpl') || !result.has('lgpl')) throw new Error('Unexpected families');
      },
    },
    {
      title: 'Non-informative claims collapse to one shared "unknown" family',
      description: 'A batch of different custom:<vendor> strings all read the same way — none of them is real evidence either way.',
      code: `families('custom:Acme End User License')
// => Set(1) { 'unknown' }`,
      assert: () => {
        const result = families('custom:Acme End User License');
        if (result.size !== 1 || !result.has('unknown')) throw new Error('Unexpected family');
      },
    },
  ],
};

export default examples;
