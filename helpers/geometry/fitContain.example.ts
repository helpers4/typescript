/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { fitContain } from './fitContain';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'fitContain',
  category: 'geometry',
  examples: [
    {
      title: 'Show a whole frame in a viewport',
      description: 'Letterboxing: bands remain above and below.',
      code: `fitContain({ width: 200, height: 100 }, { width: 100, height: 100 }) // => { scale: 0.5, x: 0, y: 25 }`,
      assert: () => {
        const fit = fitContain({ width: 200, height: 100 }, { width: 100, height: 100 });
        if (fit.scale !== 0.5 || fit.y !== 25) throw new Error('Unexpected fit');
      },
    },
    {
      title: 'Scale up',
      description: 'Small content grows until it touches the box.',
      code: `fitContain({ width: 10, height: 20 }, { width: 100, height: 100 }).scale // => 5`,
      assert: () => {
        if (fitContain({ width: 10, height: 20 }, { width: 100, height: 100 }).scale !== 5) throw new Error('Expected 5');
      },
    },
  ],
};

export default examples;
