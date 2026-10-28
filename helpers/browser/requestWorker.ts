/**
 * This file is part of helpers4.
 * Copyright (C) 2026 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { onAbort } from '../_shared/_onAbort';

/**
 * Options of {@link requestWorker}.
 * @since next
 */
export interface RequestWorkerOptions<Progress> {
  /** Objects moved to the worker with the request instead of copied. */
  transfer?: Transferable[];
  /** Called with each progress value the worker reports. */
  onProgress?: (progress: Progress) => void;
  /** Ends the worker and rejects with `signal.reason` once aborted. */
  signal?: AbortSignal;
}

/**
 * What a worker answers to {@link requestWorker}, through `postMessage`: any number of
 * `{ type: 'progress', value }`, then one `{ type: 'result', value }` or `{ type: 'error', message }`.
 * @since next
 */
export type WorkerReply<Result, Progress = never> =
  | { type: 'progress'; value: Progress }
  | { type: 'result'; value: Result }
  | { type: 'error'; message: string };

/**
 * Runs one job in a module worker: starts it, posts the request, relays its progress, resolves
 * with its result and ends it, whatever the outcome (result, error, `error` event or abort).
 * The worker answers with {@link WorkerReply} messages; a result can carry transferables by
 * posting them as `postMessage(reply, transferList)`.
 *
 * Outside a browser (no `Worker`), a URL or a string rejects with a `TypeError`; a factory is
 * called as it is.
 *
 * @param worker - The worker's URL, or a function that creates it (needed for bundlers, which only
 *   see `new Worker(new URL('./job.js', import.meta.url), { type: 'module' })` written in place)
 * @param request - The message to post
 * @param options - Transferables, progress and cancellation — see {@link RequestWorkerOptions}
 * @returns The worker's result
 * @throws {Error} (as a rejection) With the worker's message if it replies with an error, or if the worker fails to load or throws
 * @example
 * const result = await requestWorker<{ file: string }, Uint8Array, number>(
 *   () => new Worker(new URL('./bake.js', import.meta.url), { type: 'module' }),
 *   { file: 'design.fig' },
 *   { onProgress: (done) => bar.update(done) },
 * );
 * @since next
 */
export function requestWorker<Request, Result, Progress = never>(
  worker: string | URL | (() => Worker),
  request: Request,
  options: RequestWorkerOptions<Progress> = {},
): Promise<Result> {
  return new Promise<Result>((resolve, reject) => {
    if (typeof worker !== 'function' && typeof globalThis.Worker !== 'function') {
      reject(new TypeError('requestWorker needs a browser (no Worker constructor)'));
      return;
    }
    const instance = typeof worker === 'function' ? worker() : new globalThis.Worker(worker, { type: 'module' });
    let stopListening: (() => void) | undefined;
    function finish(settle: () => void): void {
      stopListening?.();
      instance.terminate();
      settle();
    }
    stopListening = onAbort(options.signal, (reason) => finish(() => reject(reason)));
    instance.addEventListener('message', (event: MessageEvent<WorkerReply<Result, Progress>>) => {
      const reply = event.data;
      if (reply.type === 'progress') options.onProgress?.(reply.value);
      else if (reply.type === 'result') finish(() => resolve(reply.value));
      else finish(() => reject(new Error(reply.message)));
    });
    instance.addEventListener('error', (event: ErrorEvent) => finish(() => reject(new Error(event.message || 'The worker failed'))));
    instance.addEventListener('messageerror', () => finish(() => reject(new Error('The worker sent a message that cannot be read'))));
    if (!options.signal?.aborted) instance.postMessage(request, options.transfer ?? []);
  });
}
