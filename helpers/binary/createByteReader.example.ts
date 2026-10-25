/**
 * This file is part of helpers4.
 * Copyright (C) 2026 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import type { HelperExamples } from '../../scripts/examples/types';
import { createByteReader } from './createByteReader';


const examples: HelperExamples = {
  helper: 'createByteReader',
  category: 'binary',
  examples: [
    {
      title: 'Decode a small binary record',
      description: 'Each read returns the value and moves on; at the end of the data it returns undefined.',
      code: `const reader = createByteReader(new Uint8Array([0x2a, 0xac, 0x02, 0x68, 0x69, 0]));
reader.readU8();      // => 42
reader.readVarU32();  // => 300
reader.readCString(); // => 'hi'
reader.readU8();      // => undefined`,
      assert: () => {
        const reader = createByteReader(new Uint8Array([0x2a, 0xac, 0x02, 0x68, 0x69, 0]));
        if (reader.readU8() !== 42 || reader.readVarU32() !== 300 || reader.readCString() !== 'hi' || reader.readU8() !== undefined) {
          throw new Error('Expected 42, 300, hi, undefined');
        }
      },
    },
    {
      title: 'A truncated read does not move the cursor',
      description: 'position tells where the failed read started, to report a precise error.',
      code: `const reader = createByteReader(new Uint8Array([1, 2, 3]));
reader.readU32(); // => undefined
reader.position;  // => 0`,
      assert: () => {
        const reader = createByteReader(new Uint8Array([1, 2, 3]));
        if (reader.readU32() !== undefined || reader.position !== 0) throw new Error('Expected an unmoved cursor');
      },
    },
  ],
};

export default examples;
