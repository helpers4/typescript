/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { pascalCaseKeys } from './pascalCaseKeys';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'pascalCaseKeys',
  category: 'object',
  examples: [
    {
      title: 'Convert object keys to PascalCase (e.g. for a C#/JSON.NET consumer)',
      description: 'Recursively converts every key, including nested objects, to PascalCase.',
      code: `pascalCaseKeys({ user_name: 'Alice', home_address: { zip_code: '12345' } })
// => { UserName: 'Alice', HomeAddress: { ZipCode: '12345' } }`,
      assert: () => {
        const result = pascalCaseKeys({ user_name: 'Alice', home_address: { zip_code: '12345' } });
        if (JSON.stringify(result) !== JSON.stringify({ UserName: 'Alice', HomeAddress: { ZipCode: '12345' } })) {
          throw new Error('Unexpected result');
        }
      },
    },
  ],
};

export default examples;
