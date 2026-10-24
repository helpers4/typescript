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
    {
      title: 'Cancel on teardown',
      description: 'An aborted signal, or cancel(), drops the call still waiting, so it never runs after its owner is gone.',
      code: `const controller = new AbortController();
const fn = throttle(() => console.log('late'), 100, { signal: controller.signal });
fn();
fn();
controller.abort();
// nothing is logged after the abort`,
      assert: async () => {
        const controller = new AbortController();
        let calls = 0;
        const fn = throttle(() => { calls++; }, 50, { signal: controller.signal });
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
