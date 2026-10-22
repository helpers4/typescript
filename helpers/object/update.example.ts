/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import type { HelperExamples } from '../../scripts/examples/types';
import { update } from './update';

const examples: HelperExamples = {
  helper: 'update',
  category: 'object',
  examples: [
    {
      title: 'Increment a counter in one call',
      description: 'Equivalent to set(obj, path, updater(get(obj, path))), without repeating the path.',
      code: `const state = { count: 1 };
update(state, 'count', (n) => (n ?? 0) + 1)
// => { count: 2 }`,
      assert: () => {
        const state = { count: 1 };
        update(state, 'count', (n) => (n ?? 0) + 1);
        if (state.count !== 2) throw new Error('Expected count to be 2');
      },
    },
    {
      title: 'Missing paths create intermediate objects, like set()',
      description: 'The updater receives undefined when the path does not exist yet.',
      code: `const stats: Record<string, unknown> = {};
update(stats, 'hits.total', (n: number | undefined) => (n ?? 0) + 1)
// => { hits: { total: 1 } }`,
      assert: () => {
        const stats: Record<string, unknown> = {};
        update(stats, 'hits.total', (n) => ((n as number | undefined) ?? 0) + 1);
        if ((stats['hits'] as Record<string, unknown>)['total'] !== 1) throw new Error('Expected total to be 1');
      },
    },
  ],
};

export default examples;
