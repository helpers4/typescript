/**
 * This file is part of helpers4.
 * Copyright (C) 2026 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import type { HelperExamples } from '../../scripts/examples/types';
import { toBase64 } from './toBase64';

const examples: HelperExamples = {
  helper: 'toBase64',
  category: 'string',
  examples: [
    {
      title: 'Encode text as UTF-8 Base64',
      description: 'Non-ASCII text is encoded as UTF-8 first, so it round-trips with fromBase64.',
      code: `toBase64('héllo')
// => 'aMOpbGxv'`,
      assert: () => {
        if (toBase64('héllo') !== 'aMOpbGxv') throw new Error('Expected aMOpbGxv');
      },
    },
    {
      title: 'URL-safe variant for tokens and URLs',
      description: 'Uses - and _ and drops the padding, ready for a query string or a JWT-like token.',
      code: `toBase64(new Uint8Array([251, 255]), { urlSafe: true })
// => '-_8'`,
      assert: () => {
        if (toBase64(new Uint8Array([251, 255]), { urlSafe: true }) !== '-_8') throw new Error('Expected -_8');
      },
    },
  ],
};

export default examples;
