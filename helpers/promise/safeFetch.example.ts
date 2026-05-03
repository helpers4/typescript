/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { safeFetch } from './safeFetch';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'safeFetch',
  category: 'promise',
  examples: [
    {
      title: 'Fetch JSON safely',
      description: 'Returns `null` on network error or non-OK status instead of throwing.',
      code: `const repo = await safeFetch<{ stars: number }>(
  'https://api.github.com/repos/helpers4/typescript'
);
if (repo === null) {
  console.warn('Failed to fetch repo data');
} else {
  console.log(repo.stars);
}`,
      assert: async () => {
        // Simulate network failure → must return null
        const original = globalThis.fetch;
        globalThis.fetch = async () => { throw new Error('offline'); };
        try {
          const result = await safeFetch('https://example.com');
          if (result !== null) throw new Error('Expected null on network error');
        } finally {
          globalThis.fetch = original;
        }
      },
    },
    {
      title: 'Fetch plain text',
      code: `const content = await safeFetch<string>(
  'https://example.com/data.txt',
  undefined,
  { parse: 'text' }
);`,
      assert: async () => {
        const original = globalThis.fetch;
        globalThis.fetch = async () => ({ ok: true, text: async () => 'hello' } as unknown as Response);
        try {
          const result = await safeFetch<string>('https://example.com', undefined, { parse: 'text' });
          if (result !== 'hello') throw new Error(`Expected "hello", got ${result}`);
        } finally {
          globalThis.fetch = original;
        }
      },
    },
  ],
};

export default examples;
