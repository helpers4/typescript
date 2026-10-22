/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { snakeCaseKeys } from './snakeCaseKeys';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'snakeCaseKeys',
  category: 'object',
  examples: [
    {
      title: 'Convert a camelCase object for a snake_case API',
      description: 'Recursively converts every key, including nested objects, to snake_case.',
      code: `snakeCaseKeys({ userName: 'Alice', homeAddress: { zipCode: '12345' } })
// => { user_name: 'Alice', home_address: { zip_code: '12345' } }`,
      assert: () => {
        const result = snakeCaseKeys({ userName: 'Alice', homeAddress: { zipCode: '12345' } });
        if (JSON.stringify(result) !== JSON.stringify({ user_name: 'Alice', home_address: { zip_code: '12345' } })) {
          throw new Error('Unexpected result');
        }
      },
    },
  ],
};

export default examples;
