/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { isFormData } from './isFormData';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'isFormData',
  category: 'type',
  examples: [
    {
      title: 'Detect a FormData',
      description: 'Returns true only for FormData instances.',
      code: `isFormData(new FormData()) // => true
isFormData({})             // => false
isFormData(null)           // => false`,
      assert: () => {
        if (!isFormData(new FormData())) throw new Error('FormData() should return true');
        if (isFormData({})) throw new Error('{} should return false');
        if (isFormData(null)) throw new Error('null should return false');
      },
    },
    {
      title: 'Filter FormData from a mixed array',
      description: 'Use as a predicate in .filter() to extract FormData values.',
      code: `const fd = new FormData();
fd.append('name', 'Alice');
const values = [fd, {}, new FormData(), 'text'];
values.filter(isFormData)
// => [FormData, FormData]`,
      assert: () => {
        const fd = new FormData();
        fd.append('name', 'Alice');
        const values: unknown[] = [fd, {}, new FormData(), 'text'];
        const result = values.filter(isFormData);
        if (result.length !== 2) throw new Error(`Expected 2, got ${result.length}`);
      },
    },
  ],
};

export default examples;
