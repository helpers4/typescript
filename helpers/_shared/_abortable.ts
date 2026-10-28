/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { onAbort } from './_onAbort.js';
import type { AbortSignalLike } from '../type/AbortSignalLike';

/**
 * Settles like `promise`, or rejects with the signal's reason as soon as `signal` aborts,
 * without waiting for `promise`. A later rejection of `promise` is then handled, not reported.
 * @param promise - The work to wait for
 * @param signal - The signal to follow, if any
 * @returns `promise` itself without a signal
 * @ignore
 */
export function abortable<T>(promise: Promise<T>, signal: AbortSignalLike | undefined): Promise<T> {
  if (!signal) return promise;
  return new Promise<T>((resolve, reject) => {
    const removeListener = onAbort(signal, reject);
    promise.then(
      (value) => {
        removeListener();
        resolve(value);
      },
      (error: unknown) => {
        removeListener();
        reject(error);
      },
    );
  });
}
