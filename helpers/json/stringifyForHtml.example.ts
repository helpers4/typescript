/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { stringifyForHtml } from './stringifyForHtml';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'stringifyForHtml',
  category: 'json',
  examples: [
    {
      title: 'Inline data in a script block',
      description: 'A value containing </script> can no longer close the element it is embedded in.',
      code: `stringifyForHtml({ note: '</script><b>' })
// => '{"note":"\\\\u003c/script\\\\u003e\\\\u003cb\\\\u003e"}'`,
      assert: () => {
        const out = stringifyForHtml({ note: '</script><b>' });
        if (out.includes('<')) throw new Error('Raw < left in the output');
      },
    },
    {
      title: 'Same value after parsing',
      description: 'The escapes are plain JSON escapes: JSON.parse gives back the original value.',
      code: `JSON.parse(stringifyForHtml({ a: '<&>' })).a
// => '<&>'`,
      assert: () => {
        if (JSON.parse(stringifyForHtml({ a: '<&>' })).a !== '<&>') throw new Error('Round trip failed');
      },
    },
  ],
};

export default examples;
