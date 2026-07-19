/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { PublishResult } from './npm-utils';

const deprecatePackageMock = vi.fn();
vi.mock('./npm-utils', () => ({ deprecatePackage: (...args: unknown[]) => deprecatePackageMock(...args) }));

const { PublishTransaction, withTransaction } = await import('./transaction-manager');

function result(overrides: Partial<PublishResult> = {}): PublishResult {
  return { packageName: '@helpers4/array', version: '3.0.0', success: true, ...overrides };
}

beforeEach(() => {
  deprecatePackageMock.mockReset();
  deprecatePackageMock.mockResolvedValue(true);
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

describe('PublishTransaction.rollback', () => {
  it('is a no-op when nothing was published', async () => {
    const tx = new PublishTransaction();
    await tx.rollback();
    expect(deprecatePackageMock).not.toHaveBeenCalled();
  });

  it('deprecates every recorded package with the rollback reason', async () => {
    const tx = new PublishTransaction();
    tx.recordPublish(result({ packageName: '@helpers4/array', version: '3.0.0' }));
    tx.recordPublish(result({ packageName: '@helpers4/all', version: '3.0.0' }));

    await tx.rollback('npm publish failed');

    expect(deprecatePackageMock).toHaveBeenCalledTimes(2);
    expect(deprecatePackageMock).toHaveBeenCalledWith('@helpers4/array', '3.0.0', 'Rollback: npm publish failed');
    expect(deprecatePackageMock).toHaveBeenCalledWith('@helpers4/all', '3.0.0', 'Rollback: npm publish failed');
  });

  it('does not roll back twice', async () => {
    const tx = new PublishTransaction();
    tx.recordPublish(result());
    await tx.rollback('first');
    await tx.rollback('second');
    expect(deprecatePackageMock).toHaveBeenCalledTimes(1);
  });

  it('does not throw when a deprecate call fails outright', async () => {
    deprecatePackageMock.mockRejectedValueOnce(new Error('registry down'));
    const tx = new PublishTransaction();
    tx.recordPublish(result());
    await expect(tx.rollback('failure')).resolves.toBeUndefined();
  });

  it('does not throw when deprecate returns false (partial rollback failure)', async () => {
    deprecatePackageMock.mockResolvedValueOnce(false);
    const tx = new PublishTransaction();
    tx.recordPublish(result());
    await expect(tx.rollback('failure')).resolves.toBeUndefined();
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
    expect(summary.rolledBack).toBe(false);
  });
});

describe('withTransaction', () => {
  it('marks the transaction completed and returns the result on success', async () => {
    const tx = new PublishTransaction();
    const outcome = await withTransaction(tx, async () => 'ok');
    expect(outcome).toBe('ok');
    expect(tx.getSummary().completed).toBe(true);
    expect(deprecatePackageMock).not.toHaveBeenCalled();
  });

  it('rolls back published packages and re-throws the original error on failure', async () => {
    const tx = new PublishTransaction();
    const failure = new Error('publish exploded');

    await expect(
      withTransaction(tx, async (t) => {
        t.recordPublish(result());
        throw failure;
      }),
    ).rejects.toThrow('publish exploded');

    expect(deprecatePackageMock).toHaveBeenCalledWith('@helpers4/array', '3.0.0', 'Rollback: publish exploded');
    expect(tx.getSummary().completed).toBe(false);
  });
});
