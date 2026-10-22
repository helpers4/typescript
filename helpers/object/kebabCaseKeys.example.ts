/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { kebabCaseKeys } from './kebabCaseKeys';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'kebabCaseKeys',
  category: 'object',
  examples: [
    {
      title: 'Convert object keys for a kebab-case config format',
      description: 'Recursively converts every key, including nested objects, to kebab-case.',
      code: `kebabCaseKeys({ userName: 'Alice', homeAddress: { zipCode: '12345' } })
// => { 'user-name': 'Alice', 'home-address': { 'zip-code': '12345' } }`,
      assert: () => {
        const result = kebabCaseKeys({ userName: 'Alice', homeAddress: { zipCode: '12345' } });
        if (
          JSON.stringify(result) !==
          JSON.stringify({ 'user-name': 'Alice', 'home-address': { 'zip-code': '12345' } })
        ) {
          throw new Error('Unexpected result');
        }
      },
    },
  ],
};

export default examples;
