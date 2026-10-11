/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { isIJson } from './isIJson';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'isIJson',
  category: 'guard',
  examples: [
    {
      title: 'Check an I-JSON message',
      description: 'Strict JSON that every implementation reads the same way.',
      code: `isIJson('{"id":1,"name":"app"}') // => true`,
      assert: () => {
        if (!isIJson('{"id":1,"name":"app"}')) throw new Error('Expected true');
      },
    },
    {
      title: 'Catch what JSON.parse silently loses',
      description: 'JSON.parse keeps the last duplicate key and rounds big integers; I-JSON rejects both.',
      code: `isIJson('{"id":1,"id":2}')  // => false
isIJson('9007199254740993') // => false`,
      assert: () => {
        if (isIJson('{"id":1,"id":2}') || isIJson('9007199254740993')) throw new Error('Expected false');
      },
    },
  ],
};

export default examples;
