/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { throttle } from './throttle';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'throttle',
  category: 'function',
  examples: [
    {
      title: 'Throttle rapid calls',
      description: 'The throttled function is invoked at most once per wait period.',
      code: `const fn = throttle(() => console.log('tick'), 100);
fn(); // executes immediately
fn(); // ignored (within wait period)`,
      assert: async () => {
        let callCount = 0;
        const fn = throttle(() => { callCount++; }, 100);
        fn();
        fn();
        fn();
        if (callCount !== 1) throw new Error(`Expected 1 immediate call, got ${callCount}`);
      },
    },
  ],
};

export default examples;
