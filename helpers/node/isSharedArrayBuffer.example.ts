/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import type { HelperExamples } from '../../scripts/examples/types';
import { isSharedArrayBuffer } from './isSharedArrayBuffer';

const examples: HelperExamples = {
  helper: 'isSharedArrayBuffer',
  category: 'node',
  examples: [
    {
      title: 'Distinguish SharedArrayBuffer from ArrayBuffer',
      description: 'Returns true only for SharedArrayBuffer instances, not plain ArrayBuffers.',
      code: `isSharedArrayBuffer(new SharedArrayBuffer(8)) // => true
isSharedArrayBuffer(new ArrayBuffer(8))       // => false
isSharedArrayBuffer(null)                     // => false`,
      assert: () => {
        if (!isSharedArrayBuffer(new SharedArrayBuffer(8))) throw new Error('SharedArrayBuffer should return true');
        if (isSharedArrayBuffer(new ArrayBuffer(8))) throw new Error('ArrayBuffer should return false');
        if (isSharedArrayBuffer(null)) throw new Error('null should return false');
      },
    },
    {
      title: 'Safe shared memory check before worker communication',
      description: 'Use as a guard to ensure a buffer can be transferred to a Worker.',
      code: `function sendToWorker(buffer: unknown): void {
  if (isSharedArrayBuffer(buffer)) {
    // buffer is SharedArrayBuffer — can be shared directly
    // worker.postMessage({ buffer });
  } else {
    // must transfer or copy
  }
}`,
      assert: () => {
        if (!isSharedArrayBuffer(new SharedArrayBuffer(0))) throw new Error('0-length SAB should return true');
        if (isSharedArrayBuffer(new Uint8Array(8).buffer)) throw new Error('ArrayBuffer view should return false');
      },
    },
  ],
};

export default examples;
