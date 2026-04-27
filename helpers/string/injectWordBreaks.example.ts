/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { injectWordBreaks } from './injectWordBreaks';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'injectWordBreaks',
  category: 'string',
  examples: [
    {
      title: 'camelCase identifier',
      description:
        'Inserts ZWS at each camelCase boundary so a long identifier can wrap in a narrow column.',
      code: `injectWordBreaks('getUserProfileData')
// => 'get\\u200BUser\\u200BProfile\\u200BData'`,
      assert: () => {
        const result = injectWordBreaks('getUserProfileData');
        if (result !== 'get\u200BUser\u200BProfile\u200BData')
          throw new Error('Unexpected result');
      },
    },
    {
      title: 'Comma-separated tokens',
      description:
        'The comma attaches to the left token so a line never starts with a comma.',
      code: `injectWordBreaks('foo,bar')
// => 'foo,\\u200Bbar'`,
      assert: () => {
        if (injectWordBreaks('foo,bar') !== 'foo,\u200Bbar')
          throw new Error('Unexpected result');
      },
    },
    {
      title: 'Atomic numeric value',
      description:
        'Signed decimals and numbers with units (-0.1%, 12ms, -2.4E+6) are never split.',
      code: `injectWordBreaks('-0.1%')
// => '-0.1%'   (unchanged — atomic value)`,
      assert: () => {
        if (injectWordBreaks('-0.1%') !== '-0.1%') throw new Error('Unexpected result');
      },
    },
    {
      title: 'File path',
      description:
        'Slashes become wrap points so a long path can break at each component.',
      code: `injectWordBreaks('path/to/my_file')
// => 'path\\u200B/\\u200Bto\\u200B/\\u200Bmy_file'`,
      assert: () => {
        if (
          injectWordBreaks('path/to/my_file') !==
          'path\u200B/\u200Bto\u200B/\u200Bmy_file'
        )
          throw new Error('Unexpected result');
      },
    },
    {
      title: 'URL is preserved intact',
      description:
        'URLs are D0-protected spans — no ZWS is inserted inside or adjacent to them.',
      code: `injectWordBreaks('https://example.com/foo/bar')
// => 'https://example.com/foo/bar'   (unchanged)`,
      assert: () => {
        if (injectWordBreaks('https://example.com/foo/bar') !== 'https://example.com/foo/bar')
          throw new Error('Unexpected result');
      },
    },
  ],
};

export default examples;
