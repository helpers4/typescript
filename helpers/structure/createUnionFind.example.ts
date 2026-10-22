/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { createUnionFind } from './createUnionFind';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'createUnionFind',
  category: 'structure',
  examples: [
    {
      title: 'Group items by a pairwise match built up incrementally',
      description: 'union() merges two items into the same set; connected() checks whether two items ended up in the same set, even through a chain of intermediate matches.',
      code: `const uf = createUnionFind<string>();
uf.union('a', 'b');
uf.union('b', 'c');
uf.connected('a', 'c'); // true — merged transitively through 'b'
uf.connected('a', 'd'); // false — 'd' was never unioned with anything`,
      assert: () => {
        const uf = createUnionFind<string>();
        uf.union('a', 'b');
        uf.union('b', 'c');
        if (!uf.connected('a', 'c')) throw new Error("Expected 'a' and 'c' to be connected");
        if (uf.connected('a', 'd')) throw new Error("Expected 'a' and 'd' to not be connected");
      },
    },
    {
      title: 'find() returns the shared representative of a set',
      description: 'Every item in the same set resolves to the same representative via find() — useful to bucket items by their final group afterwards.',
      code: `const uf = createUnionFind<number>();
uf.union(1, 2);
uf.union(2, 3);
uf.find(1) === uf.find(3) // true`,
      assert: () => {
        const uf = createUnionFind<number>();
        uf.union(1, 2);
        uf.union(2, 3);
        if (uf.find(1) !== uf.find(3)) throw new Error('Expected 1 and 3 to share a representative');
      },
    },
  ],
};

export default examples;
