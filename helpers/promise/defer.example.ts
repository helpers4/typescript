/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { defer } from './defer';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'defer',
  category: 'promise',
  examples: [
    {
      title: 'Cleanup always runs',
      description: 'Registered callbacks execute after the main function, even on success.',
      code: `const result = await defer(async (d) => {
  d(() => console.log('cleanup'));
  return 42;
});
// logs: 'cleanup' — result is 42`,
      assert: async () => {
        const log: string[] = [];
        const result = await defer(async (d) => {
          d(() => { log.push('cleanup'); });
          return 42;
        });
        if (result !== 42) throw new Error(`Expected 42, got ${result}`);
        if (!log.includes('cleanup')) throw new Error('cleanup not called');
      },
    },
    {
      title: 'LIFO order',
      description: 'Multiple callbacks are called in reverse registration order.',
      code: `await defer(async (d) => {
  d(() => console.log('step 1'));
  d(() => console.log('step 2'));
  d(() => console.log('step 3'));
});
// logs: 'step 3', 'step 2', 'step 1'`,
      assert: async () => {
        const log: string[] = [];
        await defer(async (d) => {
          d(() => { log.push('step 1'); });
          d(() => { log.push('step 2'); });
          d(() => { log.push('step 3'); });
        });
        if (JSON.stringify(log) !== JSON.stringify(['step 3', 'step 2', 'step 1']))
          throw new Error(`Unexpected order: ${JSON.stringify(log)}`);
      },
    },
    {
      title: 'Cleanup runs even on failure',
      description: 'Callbacks still execute when the main function throws; the error is re-thrown after.',
      code: `const releaseLock = () => console.log('lock released');
await defer(async (d) => {
  d(releaseLock);
  throw new Error('something failed');
}).catch(() => {});
// logs: 'lock released'`,
      assert: async () => {
        let called = false;
        await defer(async (d) => {
          d(() => { called = true; });
          throw new Error('fail');
        }).catch(() => {});
        if (!called) throw new Error('cleanup was not called on failure');
      },
    },
  ],
};

export default examples;
