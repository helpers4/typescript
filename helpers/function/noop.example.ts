/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { noop } from './noop';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'noop',
  category: 'function',
  examples: [
    {
      title: 'Use as a default callback',
      description: 'Replace an optional callback with noop to avoid null checks.',
      code: `const onComplete = options.callback ?? noop;
onComplete(); // does nothing`,
      assert: () => {
        const result = noop();
        if (result !== undefined) throw new Error('Expected undefined');
      },
    },
    {
      title: 'Silence an event handler',
      description: 'Pass noop wherever a function is required but no action is needed.',
      code: `element.addEventListener('click', noop);`,
      assert: () => {
        // noop must be callable with any args and return undefined
        if (noop() !== undefined) throw new Error('Expected undefined');
      },
    },
  ],
};

export default examples;
