/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { BehaviorSubject, distinctUntilChanged, firstValueFrom } from 'rxjs';
import { describe, expect, it } from 'vitest';
import { combine } from './combine';

describe('combine — contract', () => {
  it('combines two BehaviorSubjects using map function', async () => {
    const s1 = new BehaviorSubject(1);
    const s2 = new BehaviorSubject(2);
    const result$ = combine(s1, s2, ([a, b]) => a + b);

    expect(await firstValueFrom(result$)).toBe(3);
  });

  it('emits updated value when source1 changes', async () => {
    const s1 = new BehaviorSubject(10);
    const s2 = new BehaviorSubject(5);
    const result$ = combine(s1, s2, ([a, b]) => a * b);

    s1.next(20);
    expect(await firstValueFrom(result$)).toBe(100);
  });

  it('emits updated value when source2 changes', async () => {
    const s1 = new BehaviorSubject('hello');
    const s2 = new BehaviorSubject('world');
    const result$ = combine(s1, s2, ([a, b]) => `${a} ${b}`);

    s2.next('there');
    expect(await firstValueFrom(result$)).toBe('hello there');
  });

  it('applies preTreatment operator before mapping', async () => {
    const s1 = new BehaviorSubject(1);
    const s2 = new BehaviorSubject(1);
    const emissions: number[] = [];

    const result$ = combine(s1, s2, ([a, b]) => a + b, {
      preTreatment: distinctUntilChanged(
        ([a1, b1], [a2, b2]) => a1 === a2 && b1 === b2,
      ),
    });

    const sub = result$.subscribe(v => emissions.push(v));

    // Same values — should be deduplicated by distinctUntilChanged
    s1.next(1);
    s1.next(1);
    s2.next(1);

    // New value — should pass through
    s1.next(2);

    sub.unsubscribe();

    // Initial emission + final change (deduplicated intermediates)
    expect(emissions[0]).toBe(2); // initial: 1+1
    expect(emissions[emissions.length - 1]).toBe(3); // 2+1
  });

  it('works without options (no preTreatment)', async () => {
    const s1 = new BehaviorSubject<string[]>(['a']);
    const s2 = new BehaviorSubject<string[]>(['b']);
    const result$ = combine(s1, s2, ([a, b]) => [...a, ...b]);

    expect(await firstValueFrom(result$)).toEqual(['a', 'b']);
  });

  it('emits boolean combination', async () => {
    const flag1 = new BehaviorSubject(true);
    const flag2 = new BehaviorSubject(false);
    const result$ = combine(flag1, flag2, ([a, b]) => a && b);

    expect(await firstValueFrom(result$)).toBe(false);

    flag2.next(true);
    expect(await firstValueFrom(result$)).toBe(true);
  });
});
