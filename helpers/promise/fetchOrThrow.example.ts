/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { HttpError, fetchOrThrow } from './fetchOrThrow';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'fetchOrThrow',
  category: 'promise',
  examples: [
    {
      title: 'Fail loud on a non-2xx response',
      description: 'Resolves with the response on success, rejects with an HttpError otherwise.',
      code: `const response = await fetchOrThrow('https://api.example.com/repo');
const repo = await response.json();`,
      assert: async () => {
        const original = globalThis.fetch;
        globalThis.fetch = async () => new Response('{"stars":42}', { status: 200 });
        try {
          const response = await fetchOrThrow('https://api.example.com/repo');
          const repo = await response.json() as { stars: number };
          if (repo.stars !== 42) throw new Error(`Expected 42 stars, got ${repo.stars}`);
        } finally {
          globalThis.fetch = original;
        }
      },
    },
    {
      title: 'Handle a specific status',
      description: 'HttpError carries the status, the URL and the response, so a caller can branch on it.',
      code: `try {
  await fetchOrThrow('https://api.example.com/missing');
} catch (error) {
  if (error instanceof HttpError && error.status === 404) {
    // error.message => 'HTTP 404 Not Found: https://api.example.com/missing'
  }
}`,
      assert: async () => {
        const original = globalThis.fetch;
        globalThis.fetch = async () => new Response(null, { status: 404, statusText: 'Not Found' });
        try {
          const error = await fetchOrThrow('https://api.example.com/missing').catch((e: unknown) => e);
          if (!(error instanceof HttpError) || error.status !== 404) throw new Error('Expected an HttpError with status 404');
          if (error.message !== 'HTTP 404 Not Found: https://api.example.com/missing') {
            throw new Error(`Unexpected message: ${error.message}`);
          }
        } finally {
          globalThis.fetch = original;
        }
      },
    },
  ],
};

export default examples;
