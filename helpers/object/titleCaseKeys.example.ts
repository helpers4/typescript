/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { titleCaseKeys } from './titleCaseKeys';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'titleCaseKeys',
  category: 'object',
  examples: [
    {
      title: 'Convert object keys into display-friendly labels',
      description: 'Recursively converts every key to Title Case — useful for form labels or table headers.',
      code: `titleCaseKeys({ user_name: 'Alice', home_address: { zip_code: '12345' } })
// => { 'User Name': 'Alice', 'Home Address': { 'Zip Code': '12345' } }`,
      assert: () => {
        const result = titleCaseKeys({ user_name: 'Alice', home_address: { zip_code: '12345' } });
        if (
          JSON.stringify(result) !==
          JSON.stringify({ 'User Name': 'Alice', 'Home Address': { 'Zip Code': '12345' } })
        ) {
          throw new Error('Unexpected result');
        }
      },
    },
  ],
};

export default examples;
