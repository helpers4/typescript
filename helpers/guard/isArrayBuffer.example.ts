/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { isArrayBuffer } from './isArrayBuffer';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'isArrayBuffer',
  category: 'type',
  examples: [
    {
      title: 'Detect an ArrayBuffer',
      description: 'Returns true only for ArrayBuffer instances, not TypedArray views.',
      code: `isArrayBuffer(new ArrayBuffer(8)) // => true
isArrayBuffer(new Uint8Array(8))  // => false
isArrayBuffer('hello')            // => false`,
      assert: () => {
        if (!isArrayBuffer(new ArrayBuffer(8))) throw new Error('ArrayBuffer(8) should return true');
        if (isArrayBuffer(new Uint8Array(8))) throw new Error('Uint8Array should return false');
        if (isArrayBuffer('hello')) throw new Error('"hello" should return false');
      },
    },
    {
      title: 'Filter ArrayBuffers from a mixed array',
      description: 'Use as a predicate in .filter() to extract ArrayBuffer values.',
      code: `const values = [new ArrayBuffer(4), 'text', new ArrayBuffer(8), 42];
values.filter(isArrayBuffer)
// => [ArrayBuffer(4), ArrayBuffer(8)]`,
      assert: () => {
        const values: unknown[] = [new ArrayBuffer(4), 'text', new ArrayBuffer(8), 42];
        const result = values.filter(isArrayBuffer);
        if (result.length !== 2) throw new Error(`Expected 2, got ${result.length}`);
      },
    },
  ],
};

export default examples;
