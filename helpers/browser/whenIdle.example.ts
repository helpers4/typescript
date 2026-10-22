/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { whenIdle } from './whenIdle';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'whenIdle',
  category: 'browser',
  examples: [
    {
      title: 'Defer non-urgent work',
      description: 'Runs when the browser is idle, or after the timeout at the latest.',
      code: `whenIdle(() => preloadImages(nextScreens), { timeout: 2000 });`,
      assert: async () => {
        await new Promise<void>((resolve) => { whenIdle(resolve, { timeout: 100 }); });
      },
    },
    {
      title: 'Cancel it',
      description: 'The returned function cancels the callback if it has not run yet.',
      code: `const cancel = whenIdle(warmCache);
cancel();`,
      assert: async () => {
        let ran = false;
        whenIdle(() => { ran = true; })();
        await new Promise((resolve) => setTimeout(resolve, 10));
        if (ran) throw new Error('Expected the callback to be cancelled');
      },
    },
  ],
};

export default examples;
