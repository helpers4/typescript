/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { retry } from './retry';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'retry',
  category: 'promise',
  examples: [
    {
      title: 'Retry a failing function',
      description: 'Retries the function up to maxAttempts times before giving up.',
      code: `let attempt = 0;
await retry(() => {
  attempt++;
  if (attempt < 3) throw new Error('not yet');
  return Promise.resolve('success');
}, 3, 10)
// => 'success' (after 2 failures)`,
      assert: async () => {
        let attempt = 0;
        const result = await retry(() => {
          attempt++;
          if (attempt < 3) throw new Error('not yet');
          return Promise.resolve('success');
        }, 3, 10);
        if (result !== 'success') throw new Error('Expected success');
        if (attempt !== 3) throw new Error(`Expected 3 attempts, got ${attempt}`);
      },
    },
    {
      title: 'Exponential backoff',
      description: 'Pass a function as delayMs to make the wait grow after each failed attempt.',
      code: `const waits: number[] = [];
await retry(() => Promise.reject(new Error('down')), {
  attempts: 4,
  delayMs: (attempt) => {
    const ms = 2 ** (attempt - 1); // 1, 2, 4
    waits.push(ms);
    return ms;
  },
}).catch(() => {});
// waits => [1, 2, 4]`,
      assert: async () => {
        const waits: number[] = [];
        await retry(() => Promise.reject(new Error('down')), {
          attempts: 4,
          delayMs: (attempt) => {
            const ms = 2 ** (attempt - 1);
            waits.push(ms);
            return ms;
          },
        }).catch(() => {});
        if (waits.join(',') !== '1,2,4') throw new Error(`Expected [1, 2, 4], got [${waits.join(', ')}]`);
      },
    },
    {
      title: 'Only retry some errors',
      description: 'shouldRetry rethrows anything it rejects at once, without waiting or retrying.',
      code: `let attempt = 0;
await retry(() => {
  attempt++;
  return Promise.reject(new Error('invalid input'));
}, { attempts: 5, delayMs: 10, shouldRetry: (error) => /timeout/.test(String(error)) })
// => rejects with 'invalid input' after a single attempt`,
      assert: async () => {
        let attempt = 0;
        const error = await retry(() => {
          attempt++;
          return Promise.reject(new Error('invalid input'));
        }, { attempts: 5, delayMs: 10, shouldRetry: (e) => /timeout/.test(String(e)) }).catch((e: unknown) => e);
        if (!(error instanceof Error) || error.message !== 'invalid input') throw new Error('Expected the original error');
        if (attempt !== 1) throw new Error(`Expected 1 attempt, got ${attempt}`);
      },
    },
    {
      title: 'Rotate through mirrors',
      description: 'fn receives the 1-based attempt number, so each retry can target the next server.',
      code: `const mirrors = ['a', 'b', 'c'];
await retry((attempt) => {
  const mirror = mirrors[(attempt - 1) % mirrors.length];
  return mirror === 'c' ? Promise.resolve(mirror) : Promise.reject(new Error('down'));
}, { attempts: 3, delayMs: 0 })
// => 'c' (after 'a' and 'b' failed)`,
      assert: async () => {
        const mirrors = ['a', 'b', 'c'];
        const result = await retry((attempt) => {
          const mirror = mirrors[(attempt - 1) % mirrors.length];
          return mirror === 'c' ? Promise.resolve(mirror) : Promise.reject(new Error('down'));
        }, { attempts: 3, delayMs: 0 });
        if (result !== 'c') throw new Error(`Expected 'c', got ${result}`);
      },
    },
    {
      title: 'Stop retrying',
      description: 'An aborted signal clears the wait between attempts and starts no new one.',
      code: `const controller = new AbortController();
const result = retry(() => fetchData(), { delayMs: 5000, signal: controller.signal });
controller.abort('disabled');
await result
// rejects with 'disabled', without waiting the 5 s`,
      assert: async () => {
        const controller = new AbortController();
        let calls = 0;
        const result = retry(() => {
          calls++;
          return Promise.reject(new Error('down'));
        }, { delayMs: 5000, signal: controller.signal });
        await Promise.resolve();
        controller.abort('disabled');
        const reason = await result.then(() => 'resolved', (error: unknown) => error);
        if (reason !== 'disabled') throw new Error(`Expected 'disabled', got ${String(reason)}`);
        if (calls !== 1) throw new Error(`Expected 1 attempt, got ${calls}`);
      },
    },
  ],
};

export default examples;
