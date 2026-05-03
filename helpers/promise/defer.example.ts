/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { defer } from './defer';

// Basic usage: cleanup always runs
await defer(async (d) => {
  d(() => console.log('cleanup'));
  return 42;
});
// logs: 'cleanup'
// return value is 42

// LIFO order: last registered runs first
await defer(async (d) => {
  d(() => console.log('step 1'));
  d(() => console.log('step 2'));
  d(() => console.log('step 3'));
});
// logs: 'step 3', 'step 2', 'step 1'

// Cleanup runs even on failure
const releaseLock = () => console.log('lock released');
await defer(async (d) => {
  d(releaseLock);
  throw new Error('something failed');
}).catch(() => {});
// logs: 'lock released' — then error is swallowed by .catch

// Callback receives the error when main function throws
await defer(async (d) => {
  d((err) => {
    if (err) console.error('rolled back due to:', err);
  });
  throw new Error('tx failed');
}).catch(() => {});
// logs: 'rolled back due to: Error: tx failed'
