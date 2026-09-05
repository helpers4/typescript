/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import type { HelperExamples } from '../../scripts/examples/types';
import { unorderedPairKey } from './unorderedPairKey';

const examples: HelperExamples = {
  helper: 'unorderedPairKey',
  category: 'string',
  examples: [
    {
      title: 'Deduplicate unordered relationships in a Set',
      description: 'The same key is produced regardless of which side is passed first.',
      code: `const seen = new Set<string>();
seen.add(unorderedPairKey('alice', 'bob'));
seen.has(unorderedPairKey('bob', 'alice'))
// => true`,
      assert: () => {
        const seen = new Set<string>();
        seen.add(unorderedPairKey('alice', 'bob'));
        if (!seen.has(unorderedPairKey('bob', 'alice'))) throw new Error('Expected the key to be order-independent');
      },
    },
    {
      title: 'Custom separator',
      description: 'Pick a separator that cannot appear inside the inputs to avoid collisions.',
      code: `unorderedPairKey('bob', 'alice', ':')
// => 'alice:bob'`,
      assert: () => {
        if (unorderedPairKey('bob', 'alice', ':') !== 'alice:bob') throw new Error('Unexpected key');
      },
    },
  ],
};

export default examples;
