/**
 * This file is part of helpers4.
 * Copyright (C) 2026 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import type { HelperExamples } from '../../scripts/examples/types';
import { fromBase64 } from './fromBase64';

const examples: HelperExamples = {
  helper: 'fromBase64',
  category: 'string',
  examples: [
    {
      title: 'Decode Base64 to text',
      description: 'Either alphabet is accepted and the padding is optional.',
      code: `fromBase64('aMOpbGxv')
// => 'héllo'`,
      assert: () => {
        if (fromBase64('aMOpbGxv') !== 'héllo') throw new Error('Expected héllo');
      },
    },
    {
      title: 'Decode to raw bytes',
      description: 'Use output: bytes when the payload is not text.',
      code: `fromBase64('-_8', { output: 'bytes' })
// => Uint8Array [251, 255]`,
      assert: () => {
        const bytes = fromBase64('-_8', { output: 'bytes' });
        if (bytes.length !== 2 || bytes[0] !== 251 || bytes[1] !== 255) throw new Error('Expected [251, 255]');
      },
    },
  ],
};

export default examples;
