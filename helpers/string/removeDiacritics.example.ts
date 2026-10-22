/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import type { HelperExamples } from '../../scripts/examples/types';
import { removeDiacritics } from './removeDiacritics';

const examples: HelperExamples = {
  helper: 'removeDiacritics',
  category: 'string',
  examples: [
    {
      title: 'Strip accents from a string',
      description: 'Useful for accent-insensitive search or generating ASCII-safe identifiers.',
      code: `removeDiacritics('café')
// => 'cafe'`,
      assert: () => {
        if (removeDiacritics('café') !== 'cafe') throw new Error('Unexpected result');
      },
    },
    {
      title: 'Plain ASCII text is left unchanged',
      description: 'Only characters with combining diacritical marks are affected.',
      code: `removeDiacritics('hello world')
// => 'hello world'`,
      assert: () => {
        if (removeDiacritics('hello world') !== 'hello world') throw new Error('Expected no change');
      },
    },
  ],
};

export default examples;
