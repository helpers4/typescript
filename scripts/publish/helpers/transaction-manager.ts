/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import type { PublishResult } from './npm-utils';

export interface TransactionState {
  publishedPackages: PublishResult[];
  startTime: Date;
  completed: boolean;
  failureReported: boolean;
}

/**
 * Tracks a publishing run and reports what happened if it fails partway through.
 *
 * This does **not** attempt to roll anything back. npm has no safe undo for a publish:
 * `npm unpublish` permanently burns the version number (npm refuses to ever republish it,
 * even years later, even for a different maintainer), and `npm deprecate` needs a classic
 * authenticated token that this pipeline's OIDC/provenance publish flow doesn't provide —
 * every attempt 404s with "could not be found or you do not have permission to access it"
 * (confirmed on the 2026-08-28 release, where all 17 deprecate calls failed). So on failure
 * this just reports which packages already went live, and leaves them alone: the correct
 * recovery is to fix whatever broke and re-run the release at the *same* version, which
 * skips anything already published (see `packageVersionExists` in `npm-utils.ts`) and picks
 * up where it left off — never to bump/revert the version or unpublish the successes.
 */
export class PublishTransaction {
  private state: TransactionState;

  constructor() {
    this.state = {
      completed: false,
      failureReported: false,
      publishedPackages: [],
      startTime: new Date()
    };
  }

  /**
   * Record a successful publish
   */
  recordPublish(result: PublishResult): void {
    if (result.success && !result.skipped) {
      this.state.publishedPackages.push(result);
    }
  }

  /**
   * Get list of published packages
   */
  getPublishedPackages(): PublishResult[] {
    return [...this.state.publishedPackages];
  }

  /**
   * Check if transaction has published packages
   */
  hasPublishedPackages(): boolean {
    return this.state.publishedPackages.length > 0;
  }

  /**
   * Mark transaction as completed
   */
  markCompleted(): void {
    this.state.completed = true;
  }

  /**
   * Report a failed publishing run without touching npm. See the class doc for why this
   * doesn't attempt a rollback.
   */
  reportFailure(reason: string = 'Transaction failed'): void {
    if (this.state.failureReported) {
      return;
    }
    this.state.failureReported = true;

    console.error(`❌ Publishing failed: ${reason}`);

    if (!this.hasPublishedPackages()) {
      console.log('ℹ️  No packages were published before the failure — nothing is live.');
      return;
    }

    console.error(`📦 ${this.state.publishedPackages.length} package(s) already published successfully — they are LIVE on npm, do not unpublish them:`);
    for (const pkg of this.state.publishedPackages) {
      console.error(`   - ${pkg.packageName}@${pkg.version}`);
    }
    console.error('👉 Fix the underlying failure and re-run the release at the SAME version — already-published packages are skipped automatically.');
  }

  /**
   * Get transaction summary
   */
  getSummary(): {
    duration: number;
    packagesPublished: number;
    completed: boolean;
    startTime: Date;
  } {
    return {
      completed: this.state.completed,
      duration: Date.now() - this.state.startTime.getTime(),
      packagesPublished: this.state.publishedPackages.length,
      startTime: this.state.startTime
    };
  }
}

/**
 * Execute a function, reporting (never rolling back) published packages on failure
 */
export async function withTransaction<T>(
  transaction: PublishTransaction,
  operation: (transaction: PublishTransaction) => Promise<T>
): Promise<T> {
  try {
    const result = await operation(transaction);
    transaction.markCompleted();
    return result;
  } catch (error) {
    transaction.reportFailure(error instanceof Error ? error.message : 'Unknown error');
    throw error;
  }
}
