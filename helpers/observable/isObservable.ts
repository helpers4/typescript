/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import type { Observable } from 'rxjs';

/**
 * Checks if a value is an RxJS Observable or any compatible observable.
 *
 * Uses duck-typing: returns `true` for any object with both `.subscribe()` and
 * `.pipe()` methods, covering `Observable`, `Subject`, `BehaviorSubject`,
 * `ReplaySubject`, and any RxJS-compatible observable implementation.
 *
 * @param value - The value to check
 * @returns `true` if value is observable-like
 * @example
 * import { Observable, Subject } from 'rxjs';
 * isObservable(new Observable())  // => true
 * isObservable(new Subject())     // => true
 * isObservable(Promise.resolve()) // => false
 * isObservable({})                // => false
 * @since 2.0.3
 */
export function isObservable(value: unknown): value is Observable<unknown> {
  return (
    // Intentionally `object`-only, unlike `isPromiseLike` (see type/isPromiseLike.ts):
    // a callable function exposing `.subscribe()`/`.pipe()` would be an unusual,
    // contrived observable shape.
    value !== null &&
    typeof value === 'object' &&
    typeof (value as Record<string, unknown>)['subscribe'] === 'function' &&
    typeof (value as Record<string, unknown>)['pipe'] === 'function'
  );
}
