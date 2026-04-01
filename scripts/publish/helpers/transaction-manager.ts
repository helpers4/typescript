/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { PublishResult, deprecatePackage } from './npm-utils';

export interface TransactionState {
  publishedPackages: PublishResult[];
  startTime: Date;
  completed: boolean;
  rolledBack: boolean;
}

/**
 * Manages transactional publishing with rollback capability
 */
export class PublishTransaction {
  private state: TransactionState;

  constructor() {
    this.state = {
      publishedPackages: [],
      startTime: new Date(),
      completed: false,
      rolledBack: false
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
   * Rollback all published packages
   */
  async rollback(reason: string = 'Transaction failed'): Promise<void> {
    if (this.state.rolledBack) {
      console.log('⚠️  Transaction already rolled back');
      return;
    }

    if (!this.hasPublishedPackages()) {
      console.log('ℹ️  No packages to rollback');
      return;
    }

    console.log(`🔄 Rolling back transaction: ${reason}`);
    console.log(`📦 Packages to rollback: ${this.state.publishedPackages.length}`);

    const rollbackResults: { package: string; success: boolean }[] = [];

    for (const publishResult of this.state.publishedPackages) {
      try {
        const success = await deprecatePackage(
          publishResult.packageName,
          publishResult.version,
          `Rollback: ${reason}`
        );

        rollbackResults.push({
          package: `${publishResult.packageName}@${publishResult.version}`,
          success
        });
      } catch (error) {
        console.error(`❌ Failed to rollback ${publishResult.packageName}:`, error);
        rollbackResults.push({
          package: `${publishResult.packageName}@${publishResult.version}`,
          success: false
        });
      }
    }

    this.state.rolledBack = true;

    // Report rollback results
    const successful = rollbackResults.filter(r => r.success).length;
    const failed = rollbackResults.filter(r => !r.success).length;

    if (failed === 0) {
      console.log(`✅ Rollback completed successfully (${successful} packages deprecated)`);
    } else {
      console.error(`❌ Rollback partially failed: ${successful} succeeded, ${failed} failed`);

      console.error('❌ Manual cleanup required for:');
      rollbackResults.filter(r => !r.success).forEach(r => {
        console.error(`   - ${r.package}`);
      });
    }
  }

  /**
   * Get transaction summary
   */
  getSummary(): {
    duration: number;
    packagesPublished: number;
    completed: boolean;
    rolledBack: boolean;
    startTime: Date;
  } {
    return {
      duration: Date.now() - this.state.startTime.getTime(),
      packagesPublished: this.state.publishedPackages.length,
      completed: this.state.completed,
      rolledBack: this.state.rolledBack,
      startTime: this.state.startTime
    };
  }
}

/**
 * Execute a function with automatic transaction rollback on error
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
    console.error('❌ Operation failed, initiating rollback...');
    await transaction.rollback(error instanceof Error ? error.message : 'Unknown error');
    throw error;
  }
}
