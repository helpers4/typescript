/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { Observable, Subject } from 'rxjs';
import type { HelperExamples } from '../../scripts/examples/types';
import { isObservable } from './isObservable';

const examples: HelperExamples = {
  helper: 'isObservable',
  category: 'observable',
  examples: [
    {
      title: 'Detect an RxJS Observable or Subject',
      description: 'Returns true for Observable, Subject, BehaviorSubject, and any duck-typed observable.',
      code: `import { Observable, Subject } from 'rxjs';
isObservable(new Observable())  // => true
isObservable(new Subject())     // => true
isObservable(Promise.resolve()) // => false
isObservable({})                // => false`,
      assert: () => {
        if (!isObservable(new Observable())) throw new Error('Observable should return true');
        if (!isObservable(new Subject())) throw new Error('Subject should return true');
        if (isObservable(Promise.resolve())) throw new Error('Promise should return false');
        if (isObservable({})) throw new Error('{} should return false');
      },
    },
    {
      title: 'Accept either an Observable or a plain value',
      description: 'Use as a guard to normalize inputs that may be Observables or raw values.',
      code: `import { Observable, of } from 'rxjs';
function toObservable<T>(value: T | Observable<T>): Observable<T> {
  return isObservable(value) ? value : of(value);
}`,
      assert: () => {
        if (isObservable(null)) throw new Error('null should return false');
        if (isObservable({ subscribe: () => {} })) throw new Error('missing pipe should return false');
      },
    },
  ],
};

export default examples;
