/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { watchMedia } from './watchMedia';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'watchMedia',
  category: 'browser',
  examples: [
    {
      title: 'Follow the color scheme',
      description: 'The listener runs each time the query starts or stops matching.',
      code: `const stop = watchMedia('(prefers-color-scheme: dark)', (dark) => {
  document.documentElement.dataset.theme = dark ? 'dark' : 'light';
});`,
      assert: () => {
        const stop = watchMedia('(prefers-color-scheme: dark)', () => {});
        if (typeof stop !== 'function') throw new Error('Expected a stop function');
        stop();
      },
    },
    {
      title: 'Stop watching',
      description: 'Call the returned function, e.g. when a component is removed.',
      code: `const stop = watchMedia('(min-width: 600px)', relayout);
// later
stop();`,
      assert: () => {
        let calls = 0;
        const stop = watchMedia('(min-width: 600px)', () => { calls++; });
        stop();
        if (calls !== 0) throw new Error('Expected no call');
      },
    },
  ],
};

export default examples;
