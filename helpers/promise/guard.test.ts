/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { guard } from './guard';

describe('guard', () => {
  describe('synchronous functions', () => {
    it('should return value on success', () => {
      const result = guard(() => JSON.parse('{"a":1}'), {});
      expect(result).toEqual({ a: 1 });
    });

    it('should return default value on error', () => {
      const result = guard(() => JSON.parse('invalid'), { fallback: true });
      expect(result).toEqual({ fallback: true });
    });

    it('should work with primitive default values', () => {
      const result = guard(() => {
        throw new Error('fail');
      }, 0);
      expect(result).toBe(0);
    });

    it('should work with string default values', () => {
      const result = guard(() => {
        throw new Error('fail');
      }, 'default');
      expect(result).toBe('default');
    });

    it('should work with null default value', () => {
      const result = guard(() => {
        throw new Error('fail');
      }, null);
      expect(result).toBeNull();
    });

    it('should work with array default value', () => {
      const result = guard((): number[] => {
        throw new Error('fail');
      }, [1, 2, 3]);
      expect(result).toEqual([1, 2, 3]);
    });
  });

  describe('asynchronous functions', () => {
    it('should return value on async success', async () => {
      const result = await guard(async () => 'success', 'default');
      expect(result).toBe('success');
    });

    it('should return default value on async error', async () => {
      const result = await guard(async () => {
        throw new Error('fail');
      }, 'default');
      expect(result).toBe('default');
    });

    it('should return default value on rejected promise', async () => {
      const result = await guard(() => Promise.reject(new Error('fail')), 42);
      expect(result).toBe(42);
    });

    it('should work with complex async default values', async () => {
      const result = await guard(
        async (): Promise<Record<string, number>> => {
          throw new Error('fail');
        },
        { count: 0 },
      );
      expect(result).toEqual({ count: 0 });
    });
  });
});
