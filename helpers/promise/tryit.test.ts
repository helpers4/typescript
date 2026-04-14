/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { tryit } from './tryit';
import type { Result } from './tryit';

describe('tryit', () => {
  describe('synchronous functions', () => {
    it('should return [undefined, value] on success', () => {
      const safeParse = tryit(JSON.parse);
      const result = safeParse('{"a":1}') as Result<unknown>;
      expect(result[0]).toBeUndefined();
      expect(result[1]).toEqual({ a: 1 });
    });

    it('should return [error, undefined] on failure', () => {
      const safeParse = tryit(JSON.parse);
      const result = safeParse('invalid') as Result<unknown>;
      expect(result[0]).toBeInstanceOf(Error);
      expect(result[1]).toBeUndefined();
    });

    it('should wrap non-Error throws into Error', () => {
      const fn = tryit(() => {
        throw 'string error';
      });
      const result = fn() as Result<never>;
      expect(result[0]).toBeInstanceOf(Error);
      expect(result[0]!.message).toBe('string error');
    });

    it('should pass arguments through', () => {
      const safeAdd = tryit((a: number, b: number) => a + b);
      const result = safeAdd(2, 3) as Result<number>;
      expect(result).toEqual([undefined, 5]);
    });
  });

  describe('asynchronous functions', () => {
    it('should return [undefined, value] on async success', async () => {
      const safeFetch = tryit(async (val: string) => val);
      const result = await safeFetch('hello');
      expect(result).toEqual([undefined, 'hello']);
    });

    it('should return [error, undefined] on async failure', async () => {
      const safeFetch = tryit(async () => {
        throw new Error('network error');
      });
      const result = await safeFetch();
      expect(result[0]).toBeInstanceOf(Error);
      expect((result[0] as Error).message).toBe('network error');
      expect(result[1]).toBeUndefined();
    });

    it('should wrap non-Error async rejections into Error', async () => {
      const safeFetch = tryit(async () => {
        throw 42;
      });
      const result = await safeFetch();
      expect(result[0]).toBeInstanceOf(Error);
      expect((result[0] as Error).message).toBe('42');
    });
  });

  describe('type narrowing', () => {
    it('should allow destructuring with error check', () => {
      const safeParse = tryit(JSON.parse);
      const [error, data] = safeParse('{"x":1}') as Result<unknown>;
      if (error) {
        expect.unreachable('Should not have error');
      } else {
        expect(data).toEqual({ x: 1 });
      }
    });

    it('should allow error path destructuring', () => {
      const safeParse = tryit(JSON.parse);
      const [error, data] = safeParse('bad') as Result<unknown>;
      if (error) {
        expect(error.message).toBeDefined();
      } else {
        expect.unreachable(`Should have error, got ${data}`);
      }
    });
  });
});
