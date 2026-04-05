/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { toISO8601, toRFC2822, toRFC3339 } from './format';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'toISO8601',
  category: 'date',
  examples: [
    {
      title: 'Convert to ISO 8601',
      description: 'Formats a date as an ISO 8601 string.',
      code: `toISO8601(new Date('2025-01-19T12:30:00Z'))
// => '2025-01-19T12:30:00.000Z'`,
      assert: () => {
        const result = toISO8601(new Date('2025-01-19T12:30:00Z'));
        if (result !== '2025-01-19T12:30:00.000Z') throw new Error(`Unexpected: ${result}`);
      },
    },
    {
      title: 'Convert to RFC 3339 (no ms)',
      description: 'RFC 3339 format strips milliseconds by default.',
      code: `toRFC3339(new Date('2025-01-19T12:30:45.123Z'))
// => '2025-01-19T12:30:45Z'`,
      assert: () => {
        const result = toRFC3339(new Date('2025-01-19T12:30:45.123Z'));
        if (result !== '2025-01-19T12:30:45Z') throw new Error(`Unexpected: ${result}`);
      },
    },
    {
      title: 'Convert to RFC 2822',
      description: 'RFC 2822 is used in email and HTTP headers.',
      code: `toRFC2822(new Date('2025-01-19T12:30:00Z'))
// => 'Sun, 19 Jan 2025 12:30:00 +0000'`,
      assert: () => {
        const result = toRFC2822(new Date('2025-01-19T12:30:00Z'));
        if (result !== 'Sun, 19 Jan 2025 12:30:00 +0000') throw new Error(`Unexpected: ${result}`);
      },
    },
  ],
};

export default examples;
