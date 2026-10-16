/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { isExternalUrl } from './isExternalUrl';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'isExternalUrl',
  category: 'url',
  examples: [
    {
      title: 'Open external links in a new tab',
      description: 'Compares the link with the current origin: same-origin absolute links stay internal.',
      code: `isExternalUrl('https://github.com/helpers4', 'https://helpers4.dev')
// => true
isExternalUrl('https://helpers4.dev/docs', 'https://helpers4.dev')
// => false`,
      assert: () => {
        if (!isExternalUrl('https://github.com/helpers4', 'https://helpers4.dev')) throw new Error('Expected external');
        if (isExternalUrl('https://helpers4.dev/docs', 'https://helpers4.dev')) throw new Error('Expected internal');
      },
    },
    {
      title: 'Paths and non-HTTP schemes',
      description: 'Relative paths, anchors, mailto: and tel: are never external; protocol-relative URLs are.',
      code: `isExternalUrl('/docs')                 // => false
isExternalUrl('mailto:hi@example.com') // => false
isExternalUrl('//cdn.example.com/a.js') // => true`,
      assert: () => {
        if (isExternalUrl('/docs')) throw new Error('Path must be internal');
        if (isExternalUrl('mailto:hi@example.com')) throw new Error('mailto must be internal');
        if (!isExternalUrl('//cdn.example.com/a.js')) throw new Error('Protocol-relative must be external');
      },
    },
  ],
};

export default examples;
