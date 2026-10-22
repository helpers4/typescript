/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import type { HelperExamples } from '../../scripts/examples/types';
import { replaceOrAppend } from './replaceOrAppend';

const examples: HelperExamples = {
  helper: 'replaceOrAppend',
  category: 'array',
  examples: [
    {
      title: 'Upsert an item into a list',
      description: 'Replaces the first match, or appends when nothing matches.',
      code: `const users = [{ id: 1, name: 'a' }, { id: 2, name: 'b' }];
replaceOrAppend(users, { id: 1, name: 'A' }, (u) => u.id === 1)
// => [{ id: 1, name: 'A' }, { id: 2, name: 'b' }]`,
      assert: () => {
        const users = [{ id: 1, name: 'a' }, { id: 2, name: 'b' }];
        const result = replaceOrAppend(users, { id: 1, name: 'A' }, (u) => u.id === 1);
        if (result[0]?.name !== 'A' || result.length !== 2) throw new Error('Unexpected result');
      },
    },
    {
      title: 'Appends when no item matches',
      description: 'A missing id is added at the end rather than silently dropped.',
      code: `replaceOrAppend([{ id: 1 }], { id: 2 }, (u) => u.id === 2)
// => [{ id: 1 }, { id: 2 }]`,
      assert: () => {
        const result = replaceOrAppend([{ id: 1 }], { id: 2 }, (u) => u.id === 2);
        if (result.length !== 2 || result[1]?.id !== 2) throw new Error('Expected the item to be appended');
      },
    },
  ],
};

export default examples;
