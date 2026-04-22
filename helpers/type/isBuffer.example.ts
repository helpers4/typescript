/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { isBuffer } from './isBuffer';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'isBuffer',
  category: 'type',
  examples: [
    {
      title: 'Detect a Node.js Buffer',
      description: 'Returns true only for Buffer instances. Uint8Array is not a Buffer.',
      code: `isBuffer(Buffer.from('hello')) // => true
isBuffer(new Uint8Array(8))    // => false
isBuffer('hello')              // => false`,
      assert: () => {
        if (!isBuffer(Buffer.from('hello'))) throw new Error("Buffer.from('hello') should return true");
        if (isBuffer(new Uint8Array(8))) throw new Error('Uint8Array should return false');
        if (isBuffer('hello')) throw new Error('"hello" should return false');
      },
    },
    {
      title: 'Filter Buffers from a mixed array',
      description: 'Use as a predicate in .filter() to extract Buffer values.',
      code: `const values = [Buffer.from('a'), 'text', Buffer.alloc(4), 42];
values.filter(isBuffer)
// => [Buffer, Buffer]`,
      assert: () => {
        const values: unknown[] = [Buffer.from('a'), 'text', Buffer.alloc(4), 42];
        const result = values.filter(isBuffer);
        if (result.length !== 2) throw new Error(`Expected 2, got ${result.length}`);
      },
    },
  ],
};

export default examples;
