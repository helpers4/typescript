/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
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
    {
      title: 'Cancel on teardown',
      description: 'An aborted signal, or cancel(), drops the call still waiting, so it never runs after its owner is gone.',
      code: `const controller = new AbortController();
const fn = debounce(() => console.log('late'), 100, { signal: controller.signal });
fn();
fn();
controller.abort();
// nothing is logged after the abort`,
      assert: async () => {
        const controller = new AbortController();
        let calls = 0;
        const fn = debounce(() => { calls++; }, 50, { signal: controller.signal });
        fn();
        fn();
        const before = calls;
        controller.abort();
        fn();
        await new Promise(resolve => setTimeout(resolve, 100));
        if (calls !== before) throw new Error(`Expected ${before} calls, got ${calls}`);
      },
    },
  ],
};

export default examples;
