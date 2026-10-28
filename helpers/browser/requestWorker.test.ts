/**
 * This file is part of helpers4.
 * Copyright (C) 2026 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { afterEach, describe, expect, it, vi } from 'vitest';
import { requestWorker } from './requestWorker';
import type { WorkerReply } from './requestWorker';

class FakeWorker {
  static last: FakeWorker;
  listeners = new Map<string, (event: never) => void>();
  terminated = false;
  posted: { message: unknown; transfer: Transferable[] }[] = [];
  constructor(public url?: string | URL, public options?: WorkerOptions) {
    FakeWorker.last = this;
  }
  postMessage(message: unknown, transfer: Transferable[]): void {
    this.posted.push({ message, transfer });
  }
  addEventListener(type: string, listener: (event: never) => void): void {
    this.listeners.set(type, listener);
  }
  emit(type: string, event: object = {}): void {
    this.listeners.get(type)?.(event as never);
  }
  terminate(): void {
    this.terminated = true;
  }
  reply(data: WorkerReply<unknown, unknown>): void {
    this.emit('message', { data });
  }
}

describe('requestWorker', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('posts the request, relays progress and resolves with the result, ending the worker', async () => {
    vi.stubGlobal('Worker', FakeWorker);
    const progress: number[] = [];
    const transfer = [new ArrayBuffer(1)];
    const promise = requestWorker<string, number, number>('/job.js', 'go', { onProgress: (p) => progress.push(p), transfer });
    const worker = FakeWorker.last;
    expect(worker.url).toBe('/job.js');
    expect(worker.options).toEqual({ type: 'module' });
    expect(worker.posted).toEqual([{ message: 'go', transfer }]);
    worker.reply({ type: 'progress', value: 1 });
    worker.reply({ type: 'progress', value: 2 });
    expect(worker.terminated).toBe(false);
    worker.reply({ type: 'result', value: 42 });
    expect(await promise).toBe(42);
    expect(progress).toEqual([1, 2]);
    expect(worker.terminated).toBe(true);
  });

  it('ignores progress when nobody listens, and posts without a transfer list', async () => {
    vi.stubGlobal('Worker', FakeWorker);
    const promise = requestWorker<string, string>(new URL('https://x.dev/job.js'), 'go');
    FakeWorker.last.reply({ type: 'progress', value: 1 });
    FakeWorker.last.reply({ type: 'result', value: 'done' });
    expect(await promise).toBe('done');
    expect(FakeWorker.last.posted[0]!.transfer).toEqual([]);
  });

  it('uses a factory as it is, even without a Worker global', async () => {
    vi.stubGlobal('Worker', undefined);
    const fake = new FakeWorker();
    const promise = requestWorker(() => fake as unknown as Worker, 'go');
    fake.reply({ type: 'result', value: 1 });
    expect(await promise).toBe(1);
  });

  it('rejects with the worker error message and ends the worker', async () => {
    vi.stubGlobal('Worker', FakeWorker);
    const promise = requestWorker('/job.js', 'go');
    FakeWorker.last.reply({ type: 'error', message: 'bad file' });
    await expect(promise).rejects.toThrow('bad file');
    expect(FakeWorker.last.terminated).toBe(true);
  });

  it('rejects when the worker fails to load or throws', async () => {
    vi.stubGlobal('Worker', FakeWorker);
    const first = requestWorker('/job.js', 'go');
    FakeWorker.last.emit('error', { message: 'boom' });
    await expect(first).rejects.toThrow('boom');
    const second = requestWorker('/job.js', 'go');
    FakeWorker.last.emit('error', { message: '' });
    await expect(second).rejects.toThrow('The worker failed');
    const third = requestWorker('/job.js', 'go');
    FakeWorker.last.emit('messageerror');
    await expect(third).rejects.toThrow('cannot be read');
  });

  it('rejects with the reason and ends the worker when aborted', async () => {
    vi.stubGlobal('Worker', FakeWorker);
    const controller = new AbortController();
    const promise = requestWorker('/job.js', 'go', { signal: controller.signal });
    controller.abort(new Error('stop'));
    await expect(promise).rejects.toThrow('stop');
    expect(FakeWorker.last.terminated).toBe(true);
  });

  it('does not even post when the signal is already aborted', async () => {
    vi.stubGlobal('Worker', FakeWorker);
    const promise = requestWorker('/job.js', 'go', { signal: AbortSignal.abort(new Error('late')) });
    await expect(promise).rejects.toThrow('late');
    expect(FakeWorker.last.posted).toEqual([]);
    expect(FakeWorker.last.terminated).toBe(true);
  });

  it('rejects with a TypeError outside a browser', async () => {
    vi.stubGlobal('Worker', undefined);
    await expect(requestWorker('/job.js', 'go')).rejects.toBeInstanceOf(TypeError);
  });
});
