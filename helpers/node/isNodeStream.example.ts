/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import type { HelperExamples } from '../../scripts/examples/types';
import { isNodeStream } from './isNodeStream';

const examples: HelperExamples = {
  helper: 'isNodeStream',
  category: 'node',
  examples: [
    {
      title: 'Detect a Node.js stream',
      description: 'Returns true for any object with a .pipe() method (Readable, Writable, Transform, etc.).',
      code: `import { Readable } from 'node:stream';
isNodeStream(new Readable({ read() {} })) // => true
isNodeStream({})                          // => false
isNodeStream(null)                        // => false`,
      assert: () => {
        if (!isNodeStream({ pipe: () => {} })) throw new Error('object with pipe should be a stream');
        if (isNodeStream({})) throw new Error('{} should not be a stream');
        if (isNodeStream(null)) throw new Error('null should not be a stream');
      },
    },
    {
      title: 'Guard before piping an unknown value',
      description: 'Use isNodeStream to safely pipe only known streams.',
      code: `import { Writable } from 'node:stream';
function pipeToOutput(source: unknown, dest: Writable): void {
  if (isNodeStream(source)) {
    source.pipe(dest);
  }
}`,
      assert: () => {
        if (!isNodeStream({ pipe: () => {} })) throw new Error('duck-type pipe fn should return true');
        if (isNodeStream({ pipe: 'not-a-function' })) throw new Error('non-fn pipe should return false');
      },
    },
  ],
};

export default examples;
