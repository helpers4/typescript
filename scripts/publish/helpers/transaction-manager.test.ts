/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { PublishResult } from './npm-utils';
import { PublishTransaction, withTransaction } from './transaction-manager';

function result(overrides: Partial<PublishResult> = {}): PublishResult {
  return { packageName: '@helpers4/array', version: '3.0.0', success: true, ...overrides };
}

let errorSpy: ReturnType<typeof vi.spyOn>;
let logSpy: ReturnType<typeof vi.spyOn>;

beforeEach(() => {
  errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
});

describe('PublishTransaction.recordPublish', () => {
  it('records a successful, non-skipped publish', () => {
    const tx = new PublishTransaction();
    tx.recordPublish(result());
    expect(tx.getPublishedPackages()).toEqual([result()]);
    expect(tx.hasPublishedPackages()).toBe(true);
  });

  it('does not record a skipped publish', () => {
    const tx = new PublishTransaction();
    tx.recordPublish(result({ skipped: true }));
    expect(tx.hasPublishedPackages()).toBe(false);
  });

  it('does not record a failed publish', () => {
    const tx = new PublishTransaction();
    tx.recordPublish(result({ success: false }));
    expect(tx.hasPublishedPackages()).toBe(false);
  });
});

describe('PublishTransaction.reportFailure', () => {
  it('never touches npm — it only logs', async () => {
    const tx = new PublishTransaction();
    tx.recordPublish(result({ packageName: '@helpers4/array', version: '3.0.0' }));
    tx.recordPublish(result({ packageName: '@helpers4/all', version: '3.0.0' }));

    tx.reportFailure('npm publish failed');

    expect(errorSpy).toHaveBeenCalledWith(expect.stringContaining('@helpers4/array@3.0.0'));
    expect(errorSpy).toHaveBeenCalledWith(expect.stringContaining('@helpers4/all@3.0.0'));
  });

  it('says nothing was published when nothing was recorded', () => {
    const tx = new PublishTransaction();
    tx.reportFailure('failed before publishing anything');
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('No packages were published'));
  });

  it('only reports once', () => {
    const tx = new PublishTransaction();
    tx.recordPublish(result());
    tx.reportFailure('first');
    errorSpy.mockClear();
    logSpy.mockClear();
    tx.reportFailure('second');
    expect(errorSpy).not.toHaveBeenCalled();
    expect(logSpy).not.toHaveBeenCalled();
  });
});

describe('PublishTransaction.getSummary', () => {
  it('reflects published count and flags', () => {
    const tx = new PublishTransaction();
    tx.recordPublish(result());
    tx.markCompleted();
    const summary = tx.getSummary();
    expect(summary.packagesPublished).toBe(1);
    expect(summary.completed).toBe(true);
  });
});

describe('withTransaction', () => {
  it('marks the transaction completed and returns the result on success', async () => {
    const tx = new PublishTransaction();
    const outcome = await withTransaction(tx, async () => 'ok');
    expect(outcome).toBe('ok');
    expect(tx.getSummary().completed).toBe(true);
    expect(errorSpy).not.toHaveBeenCalled();
  });

  it('reports published packages and re-throws the original error on failure', async () => {
    const tx = new PublishTransaction();
    const failure = new Error('publish exploded');

    await expect(
      withTransaction(tx, async (t) => {
        t.recordPublish(result());
        throw failure;
      }),
    ).rejects.toThrow('publish exploded');

    expect(errorSpy).toHaveBeenCalledWith(expect.stringContaining('publish exploded'));
    expect(errorSpy).toHaveBeenCalledWith(expect.stringContaining('@helpers4/array@3.0.0'));
    expect(tx.getSummary().completed).toBe(false);
  });
});
