/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import type { HelperExamples } from '../../scripts/examples/types';
import { unflatten } from './unflatten';

const examples: HelperExamples = {
  helper: 'unflatten',
  category: 'object',
  examples: [
    {
      title: 'Rebuild a nested object from dotted keys',
      description: 'The inverse of flatten() — useful for parsing flat config sources (env vars, .ini files).',
      code: `unflatten({ 'server.host': 'localhost', 'server.port': 8080 })
// => { server: { host: 'localhost', port: 8080 } }`,
      assert: () => {
        const result = unflatten({ 'server.host': 'localhost', 'server.port': 8080 });
        const server = result['server'] as Record<string, unknown>;
        if (server['host'] !== 'localhost' || server['port'] !== 8080) throw new Error('Unexpected result');
      },
    },
    {
      title: 'Multiple keys under the same parent are merged',
      description: 'Every dotted key contributes to the same nested structure.',
      code: `unflatten({ 'a.x': 1, 'a.y': 2 })
// => { a: { x: 1, y: 2 } }`,
      assert: () => {
        const result = unflatten({ 'a.x': 1, 'a.y': 2 });
        if (JSON.stringify(result) !== JSON.stringify({ a: { x: 1, y: 2 } })) throw new Error('Unexpected result');
      },
    },
  ],
};

export default examples;
