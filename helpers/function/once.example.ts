/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { once } from './once';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'once',
  category: 'function',
  examples: [
    {
      title: 'Run expensive setup only once',
      description: 'The wrapped function executes only on the first call; all subsequent calls return the cached result.',
      code: `const init = once(() => ({ config: 'loaded' }));

const a = init(); // runs the function
const b = init(); // returns cached result
a === b; // => true

init.reset(); // clear cache
const c = init(); // runs the function again
a === c; // => false (new object)`,
      assert: () => {
        const init = once(() => ({ config: 'loaded' }));
        const a = init();
        const b = init();
        if (a !== b) throw new Error('Expected same reference before reset');
        init.reset();
        const c = init();
        if (a === c) throw new Error('Expected new reference after reset');
      },
    },
    {
      title: 'Guard against multiple event-listener registrations',
      description: 'Ensure a side-effecting setup (e.g. addEventListener) runs at most once.',
      code: `const register = once((el: HTMLElement) => {
  el.addEventListener('click', handler);
});

register(button); // registers handler
register(button); // no-op — handler already registered`,
      assert: () => {
        let count = 0;
        const register = once(() => { count++; });
        register();
        register();
        if (count !== 1) throw new Error(`Expected 1, got ${count}`);
      },
    },
  ],
};

export default examples;
