/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { describe, expect, it } from 'vitest';
import { combineLatest } from './combineLatest';

describe('combineLatest — contract', () => {
  it('empty array [] emits []', async () => {
    const result$ = combineLatest([]);
    expect(await firstValueFrom(result$)).toEqual([]);
  });

  it('empty object {} emits {}', async () => {
    const result$ = combineLatest({});
    expect(await firstValueFrom(result$)).toEqual({});
  });

  it('[BehaviorSubject(1), BehaviorSubject(2)] emits [1, 2]', async () => {
    const s1 = new BehaviorSubject(1);
    const s2 = new BehaviorSubject(2);
    const result$ = combineLatest([s1, s2]);

    expect(await firstValueFrom(result$)).toEqual([1, 2]);
  });

  it('{a: BehaviorSubject(1)} emits {a: 1}', async () => {
    const s = new BehaviorSubject(1);
    const result$ = combineLatest({ a: s });

    expect(await firstValueFrom(result$)).toEqual({ a: 1 });
  });

  it('{a: BehaviorSubject(1), b: BehaviorSubject("x")} emits {a: 1, b: "x"}', async () => {
    const sa = new BehaviorSubject(1);
    const sb = new BehaviorSubject('x');
    const result$ = combineLatest({ a: sa, b: sb });

    expect(await firstValueFrom(result$)).toEqual({ a: 1, b: 'x' });
  });

  it('emits updated values when a source changes', async () => {
    const s1 = new BehaviorSubject(10);
    const s2 = new BehaviorSubject(20);
    const result$ = combineLatest([s1, s2]);

    s1.next(99);
    expect(await firstValueFrom(result$)).toEqual([99, 20]);
  });
});
