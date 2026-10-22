/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { stripV } from './stripV';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'stripV',
  category: 'version',
  examples: [
    {
      title: 'Remove v prefix from a version string',
      description: 'Strips the leading "v" from a git tag-style version string.',
      code: `stripV('v1.2.3')
// => '1.2.3'`,
      assert: () => {
        if (stripV('v1.2.3') !== '1.2.3') throw new Error('Unexpected result');
      },
    },
    {
      title: 'No-op when there is no v prefix',
      description: 'Returns the string unchanged when it does not start with "v".',
      code: `stripV('1.2.3')
// => '1.2.3'`,
      assert: () => {
        if (stripV('1.2.3') !== '1.2.3') throw new Error('Unexpected result');
      },
    },
  ],
};

export default examples;
