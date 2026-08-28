/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { formatSize } from './formatSize';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'formatSize',
  category: 'number',
  examples: [
    {
      title: 'Format bytes to human-readable size',
      description: 'Converts a raw byte count to a human-readable string using binary prefixes.',
      code: `formatSize(0)             // '0.0B'
formatSize(512)           // '512.0B'
formatSize(1024)          // '1.0KB'
formatSize(1_048_576)     // '1.0MB'
formatSize(1_073_741_824) // '1.0GB'`,
      assert: () => {
        if (formatSize(0) !== '0.0B') throw new Error(`Unexpected: ${formatSize(0)}`);
        if (formatSize(1024) !== '1.0KB') throw new Error(`Unexpected: ${formatSize(1024)}`);
        if (formatSize(1_048_576) !== '1.0MB') throw new Error(`Unexpected: ${formatSize(1_048_576)}`);
      },
    },
    {
      title: 'Space before the unit, and a bare integer below the first unit',
      description: 'unitSeparator inserts a separator before the unit; integerBelowFirstUnit drops the decimal for byte counts under 1024.',
      code: `formatSize(1536, { unitSeparator: ' ' })                            // '1.5 KB'
formatSize(512, { integerBelowFirstUnit: true })                    // '512B'
formatSize(512, { unitSeparator: ' ', integerBelowFirstUnit: true }) // '512 B'`,
      assert: () => {
        if (formatSize(1536, { unitSeparator: ' ' }) !== '1.5 KB') throw new Error(`Unexpected: ${formatSize(1536, { unitSeparator: ' ' })}`);
        if (formatSize(512, { integerBelowFirstUnit: true }) !== '512B') throw new Error(`Unexpected: ${formatSize(512, { integerBelowFirstUnit: true })}`);
        const both = formatSize(512, { unitSeparator: ' ', integerBelowFirstUnit: true });
        if (both !== '512 B') throw new Error(`Unexpected: ${both}`);
      },
    },
  ],
};

export default examples;
