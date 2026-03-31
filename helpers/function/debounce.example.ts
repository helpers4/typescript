/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { debounce } from './debounce';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'debounce',
  category: 'function',
  examples: [
    {
      title: 'Debounce a function',
      description: 'The debounced function is only called once after the delay, even if invoked multiple times.',
      code: `const fn = debounce((x: number) => console.log(x), 100);
fn(1);
fn(2);
fn(3);
// Only logs 3 after 100ms`,
      assert: async () => {
        let callCount = 0;
        const fn = debounce(() => { callCount++; }, 50);
        fn();
        fn();
        fn();
        await new Promise(resolve => setTimeout(resolve, 100));
        if (callCount !== 1) throw new Error(`Expected 1 call, got ${callCount}`);
      },
    },
  ],
};

export default examples;
