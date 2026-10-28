/**
 * This file is part of helpers4.
 * Copyright (C) 2026 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { requestWorker } from './requestWorker';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'requestWorker',
  category: 'browser',
  examples: [
    {
      title: 'Run a job with progress',
      description: 'The worker replies with progress messages, then a result; it is ended afterwards.',
      code: `const bytes = await requestWorker<string, Uint8Array, number>(
  () => new Worker(new URL('./bake.js', import.meta.url), { type: 'module' }),
  'design.fig',
  { onProgress: (done) => bar.update(done) },
);`,
      assert: async () => {
        const saved = globalThis.Worker;
        try {
          Reflect.deleteProperty(globalThis, 'Worker');
          const result = await requestWorker('/bake.js', 'design.fig').catch(() => 'no worker');
          if (result !== 'no worker') throw new Error('Expected a rejection outside a browser');
        } finally {
          if (saved) globalThis.Worker = saved;
        }
      },
    },
  ],
};

export default examples;
