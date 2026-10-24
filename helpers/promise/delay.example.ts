/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { delay } from './delay';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'delay',
  category: 'promise',
  examples: [
    {
      title: 'Wait a specified duration',
      description: 'Creates a promise that resolves after the given milliseconds.',
      code: `await delay(100)
// resolves after 100ms`,
      assert: async () => {
        const start = Date.now();
        await delay(50);
        const elapsed = Date.now() - start;
        if (elapsed < 40) throw new Error(`Too fast: ${elapsed}ms`);
      },
    },
    {
      title: 'Resolve with a value',
      description: 'Optionally resolves with a provided value.',
      code: `const result = await delay(100, 'done')
// => 'done'`,
      assert: async () => {
        const result = await delay(10, 'done');
        if (result !== 'done') throw new Error(`Expected 'done', got ${result}`);
      },
    },
    {
      title: 'Cancel the wait',
      description: 'An aborted signal clears the timer and rejects with its reason, so nothing is left running on teardown.',
      code: `const controller = new AbortController()
const wait = delay(5000, undefined, { signal: controller.signal })
controller.abort('disabled')
await wait
// rejects with 'disabled', at once`,
      assert: async () => {
        const controller = new AbortController();
        const wait = delay(5000, undefined, { signal: controller.signal });
        controller.abort('disabled');
        const reason = await wait.then(() => 'resolved', (error: unknown) => error);
        if (reason !== 'disabled') throw new Error(`Expected 'disabled', got ${String(reason)}`);
      },
    },
  ],
};

export default examples;
