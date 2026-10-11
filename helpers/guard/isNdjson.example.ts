/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { isNdjson } from './isNdjson';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'isNdjson',
  category: 'guard',
  examples: [
    {
      title: 'Check newline-delimited JSON',
      description: 'One strict JSON value per line.',
      code: `isNdjson('{"id":1}\\n{"id":2}\\n') // => true`,
      assert: () => {
        if (!isNdjson('{"id":1}\n{"id":2}\n')) throw new Error('Expected true');
      },
    },
    {
      title: 'A value cannot span lines',
      description: 'Pretty-printed JSON is not NDJSON.',
      code: `isNdjson('{\\n  "id": 1\\n}') // => false`,
      assert: () => {
        if (isNdjson('{\n  "id": 1\n}')) throw new Error('Expected false');
      },
    },
  ],
};

export default examples;
