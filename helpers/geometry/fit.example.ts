/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { fit } from './fit';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'fit',
  category: 'geometry',
  examples: [
    {
      title: 'Show a frame in a viewport',
      description: 'contain (the default) keeps the whole frame visible, centered.',
      code: `fit({ width: 200, height: 100 }, { width: 100, height: 100 })
// => { a: 0.5, b: 0, c: 0, d: 0.5, e: 0, f: 25 }`,
      assert: () => {
        const m = fit({ width: 200, height: 100 }, { width: 100, height: 100 });
        if (m.a !== 0.5 || m.f !== 25) throw new Error('Unexpected fit');
      },
    },
    {
      title: 'Cover, aligned to the left',
      description: 'Like object-fit: cover; object-position: left.',
      code: `fit({ width: 200, height: 100 }, { width: 100, height: 100 }, { mode: 'cover', align: { x: 0 } })
// => { a: 1, b: 0, c: 0, d: 1, e: 0, f: 0 }`,
      assert: () => {
        const m = fit({ width: 200, height: 100 }, { width: 100, height: 100 }, { mode: 'cover', align: { x: 0 } });
        if (m.a !== 1 || m.e !== 0) throw new Error('Unexpected fit');
      },
    },
  ],
};

export default examples;
