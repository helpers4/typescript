/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { uuid7 } from './uuid7';
import type { HelperExamples } from '../../scripts/examples/types';

const UUID7_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;

const examples: HelperExamples = {
  helper: 'uuid7',
  category: 'math',
  examples: [
    {
      title: 'Generate a UUID v7',
      description:
        'Produces a RFC 9562 UUID v7 string with an embedded millisecond timestamp.',
      code: `uuid7()
// => "019077e0-5c70-7b3a-8a1f-3e4d5b6c7d8e"`,
      assert: () => {
        const id = uuid7();
        if (!UUID7_REGEX.test(id))
          throw new Error(`Invalid UUID v7 format: ${id}`);
      },
    },
    {
      title: 'UUIDs are chronologically sortable',
      description:
        'UUID v7 values generated later are lexicographically greater, making them ideal for database primary keys.',
      code: `const id1 = uuid7();
// ... later ...
const id2 = uuid7();
id1 < id2 // => true`,
      assert: () => {
        const id1 = uuid7();
        const start = Date.now();
        while (Date.now() === start) {
          // wait for next millisecond
        }
        const id2 = uuid7();
        if (id1 >= id2)
          throw new Error(`Expected ${id1} < ${id2}`);
      },
    },
    {
      title: 'Each UUID is unique',
      description: 'No two calls produce the same value.',
      code: `uuid7() !== uuid7() // => true`,
      assert: () => {
        const a = uuid7();
        const b = uuid7();
        if (a === b) throw new Error('UUIDs should be unique');
      },
    },
  ],
};

export default examples;
