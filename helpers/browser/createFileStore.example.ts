/**
 * This file is part of helpers4.
 * Copyright (C) 2026 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { createFileStore } from './createFileStore';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'createFileStore',
  category: 'browser',
  examples: [
    {
      title: 'Keep a bake for the next visit',
      description: 'Files go under a key and a version; a new version is a miss.',
      code: `const store = createFileStore('bakes');
await store.put('design-1', { 'a.png': blob, 'index.json': '{}' }, 'v3');
const files = await store.get('design-1', 'v3'); // => { 'a.png': Blob, 'index.json': Blob }`,
      assert: async () => {
        const saved = globalThis.caches;
        try {
          Reflect.deleteProperty(globalThis, 'caches');
          const store = createFileStore('bakes');
          if ((await store.get('design-1', 'v3')) !== undefined) throw new Error('Expected a miss without the Cache API');
        } finally {
          if (saved) Object.defineProperty(globalThis, 'caches', { value: saved, configurable: true });
        }
      },
    },
  ],
};

export default examples;
