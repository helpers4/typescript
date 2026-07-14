/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import type { HelperExamples } from '../../scripts/examples/types';
import { toggle } from './toggle';

const examples: HelperExamples = {
  helper: 'toggle',
  category: 'array',
  examples: [
    {
      title: 'Toggle a selection',
      description: 'Common pattern for multi-select UI state — add if absent, remove if present.',
      code: `toggle([1, 2, 3], 2)
// => [1, 3]
toggle([1, 3], 2)
// => [1, 3, 2]`,
      assert: () => {
        if (JSON.stringify(toggle([1, 2, 3], 2)) !== JSON.stringify([1, 3])) throw new Error('Expected removal');
        if (JSON.stringify(toggle([1, 3], 2)) !== JSON.stringify([1, 3, 2])) throw new Error('Expected append');
      },
    },
    {
      title: 'Toggle objects by a derived key',
      description: 'Pass a key selector to compare by id instead of object reference.',
      code: `const selected = [{ id: 1 }, { id: 2 }];
toggle(selected, { id: 1 }, (x) => x.id)
// => [{ id: 2 }]`,
      assert: () => {
        const selected = [{ id: 1 }, { id: 2 }];
        const result = toggle(selected, { id: 1 }, (x) => x.id);
        if (result.length !== 1 || result[0]?.id !== 2) throw new Error('Expected id 1 to be toggled off');
      },
    },
  ],
};

export default examples;
