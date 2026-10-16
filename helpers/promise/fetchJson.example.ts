/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { fetchJson } from './fetchJson';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'fetchJson',
  category: 'promise',
  examples: [
    {
      title: 'Fetch JSON, retrying transient failures',
      description: 'A 503 is retried; once the server answers, the parsed body is returned.',
      code: `// the server answers 503, then 200 with { "stars": 42 }
await fetchJson<{ stars: number }>('https://api.example.com/repo', undefined, { retry: { delayMs: 0 } })
// => { stars: 42 }`,
      assert: async () => {
        const original = globalThis.fetch;
        let calls = 0;
        globalThis.fetch = (() => {
          calls++;
          return Promise.resolve(calls === 1
            ? new Response('', { status: 503 })
            : new Response(JSON.stringify({ stars: 42 }), { status: 200 }));
        }) as typeof fetch;
        try {
          const result = await fetchJson<{ stars: number }>('https://api.example.com/repo', undefined, { retry: { delayMs: 0 } });
          if (result.stars !== 42 || calls !== 2) throw new Error(`Unexpected: ${JSON.stringify(result)} after ${calls} call(s)`);
        } finally {
          globalThis.fetch = original;
        }
      },
    },
    {
      title: 'A 404 is not retried',
      description: 'Client errors fail at once with an HttpError carrying the status.',
      code: `await fetchJson('https://api.example.com/missing')
// throws HttpError { status: 404 } after a single request`,
      assert: async () => {
        const original = globalThis.fetch;
        let calls = 0;
        globalThis.fetch = (() => {
          calls++;
          return Promise.resolve(new Response('', { status: 404 }));
        }) as typeof fetch;
        try {
          const error = await fetchJson('https://api.example.com/missing', undefined, { retry: { delayMs: 0 } }).catch((e: unknown) => e);
          if (!(error instanceof Error) || error.name !== 'HttpError' || calls !== 1) throw new Error('Expected a single failed request');
        } finally {
          globalThis.fetch = original;
        }
      },
    },
  ],
};

export default examples;
