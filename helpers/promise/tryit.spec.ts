/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { type Result, tryit } from './tryit';

type ResultTuple = Result<unknown>;

describe('tryit — property-based', () => {
  it('result is always a tuple of length 2', () => {
    fc.assert(
      fc.property(fc.integer(), (value: number) => {
        const safe = tryit(() => value);
        const result: ResultTuple = safe();
        expect(result).toHaveLength(2);
      }),
    );
  });

  it('success: first element is undefined, second is the value', () => {
    fc.assert(
      fc.property(fc.string(), (value: string) => {
        const safe = tryit(() => value);
        const result: ResultTuple = safe();
        expect(result[0]).toBeUndefined();
        expect(result[1]).toBe(value);
      }),
    );
  });

  it('error: first element is an Error, second is undefined', () => {
    fc.assert(
      fc.property(fc.string({ minLength: 1 }), (msg: string) => {
        const safe = tryit(() => { throw new Error(msg); });
        const result: ResultTuple = safe();
        expect(result[0]).toBeInstanceOf(Error);
        expect(result[1]).toBeUndefined();
      }),
    );
  });

  it('non-Error thrown values are wrapped in Error', () => {
    fc.assert(
      fc.property(fc.string({ minLength: 1 }), (msg: string) => {
        // eslint-disable-next-line @typescript-eslint/only-throw-error
        const safe = tryit(() => { throw msg; });
        const result: ResultTuple = safe();
        expect(result[0]).toBeInstanceOf(Error);
        expect(result[1]).toBeUndefined();
      }),
    );
  });
});

describe('tryit — contract', () => {
  it('sync success → [undefined, value]', () => {
    const safe = tryit(() => 42);
    const result: ResultTuple = safe();
    expect(result[0]).toBeUndefined();
    expect(result[1]).toBe(42);
  });

  it('sync throw Error → [Error, undefined]', () => {
    const safe = tryit(() => { throw new Error('boom'); });
    const result: ResultTuple = safe();
    expect(result[0]).toBeInstanceOf(Error);
    expect((result[0] as Error).message).toBe('boom');
    expect(result[1]).toBeUndefined();
  });

  it('sync throw string → [Error, undefined] (wrapped)', () => {
    // eslint-disable-next-line @typescript-eslint/only-throw-error
    const safe = tryit(() => { throw 'string error'; });
    const result: ResultTuple = safe();
    expect(result[0]).toBeInstanceOf(Error);
    expect(result[1]).toBeUndefined();
  });

  it('async success → [undefined, value]', async () => {
    const safe = tryit(async () => 'async result');
    const result = await safe();
    expect(result[0]).toBeUndefined();
    expect(result[1]).toBe('async result');
  });

  it('async throw → [Error, undefined]', async () => {
    const safe = tryit(async () => { throw new Error('async boom'); });
    const result = await safe();
    expect(result[0]).toBeInstanceOf(Error);
    expect((result[0] as Error).message).toBe('async boom');
    expect(result[1]).toBeUndefined();
  });

  it('works with JSON.parse success', () => {
    const safeParse = tryit((s: string) => JSON.parse(s) as unknown);
    const result: ResultTuple = safeParse('{"a":1}');
    expect(result[0]).toBeUndefined();
    expect(result[1]).toEqual({ a: 1 });
  });

  it('works with JSON.parse failure', () => {
    const safeParse = tryit((s: string) => JSON.parse(s) as unknown);
    const result: ResultTuple = safeParse('invalid');
    expect(result[0]).toBeInstanceOf(Error);
    expect(result[1]).toBeUndefined();
  });
});
