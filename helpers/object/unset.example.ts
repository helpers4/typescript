/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import type { HelperExamples } from '../../scripts/examples/types';
import { unset } from './unset';

const examples: HelperExamples = {
  helper: 'unset',
  category: 'object',
  examples: [
    {
      title: 'Remove a nested value by path',
      description: 'Uses the same dot/bracket path syntax as get() and set().',
      code: `const config = { server: { host: 'localhost', debug: true } };
unset(config, 'server.debug')
// => { server: { host: 'localhost' } }`,
      assert: () => {
        const config: Record<string, unknown> = { server: { host: 'localhost', debug: true } };
        unset(config, 'server.debug');
        if (Object.hasOwn(config['server'] as object, 'debug')) throw new Error('Expected debug to be removed');
      },
    },
    {
      title: 'Missing paths are a safe no-op',
      description: 'Unlike set(), unset() never creates intermediate objects — there is nothing to remove.',
      code: `unset({ a: 1 }, 'x.y.z')
// => { a: 1 }  (unchanged)`,
      assert: () => {
        const obj = { a: 1 };
        const result = unset(obj, 'x.y.z');
        if (result !== obj || Object.keys(result).length !== 1) throw new Error('Expected object unchanged');
      },
    },
  ],
};

export default examples;
