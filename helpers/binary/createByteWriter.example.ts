/**
 * This file is part of helpers4.
 * Copyright (C) 2026 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import type { HelperExamples } from '../../scripts/examples/types';
import { createByteWriter } from './createByteWriter';


const examples: HelperExamples = {
  helper: 'createByteWriter',
  category: 'binary',
  examples: [
    {
      title: 'Encode a small binary record',
      description: 'Writes chain, and toBytes returns the result.',
      code: `createByteWriter().writeU8(42).writeVarU32(300).writeCString('hi').toBytes()
// => Uint8Array [0x2a, 0xac, 0x02, 0x68, 0x69, 0]`,
      assert: () => {
        const bytes = createByteWriter().writeU8(42).writeVarU32(300).writeCString('hi').toBytes();
        if (bytes.join() !== '42,172,2,104,105,0') throw new Error('Expected the record bytes');
      },
    },
    {
      title: 'Choose the byte order',
      description: 'Multi-byte values are big-endian unless you say little.',
      code: `createByteWriter().writeU16(1).writeU16(1, 'little').toBytes()
// => Uint8Array [0, 1, 1, 0]`,
      assert: () => {
        const bytes = createByteWriter().writeU16(1).writeU16(1, 'little').toBytes();
        if (bytes.join() !== '0,1,1,0') throw new Error('Expected 0,1,1,0');
      },
    },
  ],
};

export default examples;
