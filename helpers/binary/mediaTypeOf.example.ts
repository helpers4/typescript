/**
 * This file is part of helpers4.
 * Copyright (C) 2026 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { mediaTypeOf } from './mediaTypeOf';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'mediaTypeOf',
  category: 'binary',
  examples: [
    {
      title: 'Sniff an image',
      description: 'The first bytes tell the format, whatever the file is called.',
      code: `mediaTypeOf(new Uint8Array([0xff, 0xd8, 0xff, 0xe0])) // => 'image/jpeg'`,
      assert: () => {
        if (mediaTypeOf(new Uint8Array([0xff, 0xd8, 0xff, 0xe0])) !== 'image/jpeg') throw new Error('Expected image/jpeg');
      },
    },
  ],
};

export default examples;
