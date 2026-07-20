/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { camelCaseKeys } from './camelCaseKeys';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'camelCaseKeys',
  category: 'object',
  examples: [
    {
      title: 'Convert a snake_case API response',
      description: 'Recursively converts every key, including nested objects, to camelCase.',
      code: `camelCaseKeys({ user_name: 'Alice', home_address: { zip_code: '12345' } })
// => { userName: 'Alice', homeAddress: { zipCode: '12345' } }`,
      assert: () => {
        const result = camelCaseKeys({ user_name: 'Alice', home_address: { zip_code: '12345' } });
        if (JSON.stringify(result) !== JSON.stringify({ userName: 'Alice', homeAddress: { zipCode: '12345' } })) {
          throw new Error('Unexpected result');
        }
      },
    },
    {
      title: 'Arrays of objects are walked too',
      description: 'Each object inside an array gets its keys converted.',
      code: `camelCaseKeys({ user_list: [{ first_name: 'A' }] })
// => { userList: [{ firstName: 'A' }] }`,
      assert: () => {
        const result = camelCaseKeys({ user_list: [{ first_name: 'A' }] });
        if (JSON.stringify(result) !== JSON.stringify({ userList: [{ firstName: 'A' }] })) {
          throw new Error('Unexpected result');
        }
      },
    },
  ],
};

export default examples;
