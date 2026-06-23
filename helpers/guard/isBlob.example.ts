/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { isBlob } from './isBlob';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'isBlob',
  category: 'type',
  examples: [
    {
      title: 'Detect a Blob',
      description: 'Returns true only for Blob instances.',
      code: `isBlob(new Blob(['hello'])) // => true
isBlob(new Blob([], { type: 'application/json' })) // => true
isBlob('hello')             // => false`,
      assert: () => {
        if (!isBlob(new Blob(['hello']))) throw new Error("Blob(['hello']) should return true");
        if (isBlob('hello')) throw new Error('"hello" should return false');
        if (isBlob(null)) throw new Error('null should return false');
      },
    },
    {
      title: 'Filter Blobs from a mixed array',
      description: 'Use as a predicate in .filter() to extract Blob values.',
      code: `const values = [new Blob(['a']), 'text', new Blob(['b']), 42];
values.filter(isBlob)
// => [Blob, Blob]`,
      assert: () => {
        const values: unknown[] = [new Blob(['a']), 'text', new Blob(['b']), 42];
        const result = values.filter(isBlob);
        if (result.length !== 2) throw new Error(`Expected 2, got ${result.length}`);
      },
    },
  ],
};

export default examples;
