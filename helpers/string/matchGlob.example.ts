/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { matchGlob } from './matchGlob';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'matchGlob',
  category: 'string',
  examples: [
    {
      title: 'Filter file names',
      description: '* matches any sequence, ? exactly one character.',
      code: `['a.fig', 'b.sketch', 'c.fig'].filter((name) => matchGlob('*.fig', name))
// => ['a.fig', 'c.fig']`,
      assert: () => {
        const kept = ['a.fig', 'b.sketch', 'c.fig'].filter((name) => matchGlob('*.fig', name));
        if (kept.join() !== 'a.fig,c.fig') throw new Error('Expected a.fig and c.fig');
      },
    },
    {
      title: 'Ignore case',
      description: 'Pass false as the third argument.',
      code: `matchGlob('Screen ?', 'screen 2', false) // => true`,
      assert: () => {
        if (!matchGlob('Screen ?', 'screen 2', false)) throw new Error('Expected a match');
      },
    },
  ],
};

export default examples;
