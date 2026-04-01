/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/*
 * This program is under the terms of the GNU Lesser General Public License version 3
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import {
  Observable,
  OperatorFunction,
  combineLatest as combineLatestOperator,
  map as mapOperator,
} from "rxjs";


type combineOptions<T, U> = {
  readonly preTreatment?: OperatorFunction<readonly [T, U], readonly [T, U]>;
};

/**
 * Combine two observables with a map function and an optional pre-treatment.
 *
 * Note: you can use the pre-treatment to add a filter, a distinctUntilChanged,
 * any other operator that can be used in a pipe, or even an `UntilDestroy`
 * operator.
 *
 * @param source1 first source of data
 * @param source2 second source of data
 * @param map way to combine data
 * @param options options for the combineLatest operator
 * @returns an observable that emits the result of the map function
 * @see combineLatestOperator
 * @see mapOperator
 */
export function combine<T, U, R>(
  source1: Observable<T>,
  source2: Observable<U>,
  map: (c: readonly [T, U]) => R,
  options?: combineOptions<T, U>
): Observable<R> {
  if (options?.preTreatment) {
    return combineLatestOperator([source1, source2]).pipe(
      options.preTreatment,
      mapOperator(map)
    );
  } else {
    return combineLatestOperator([source1, source2]).pipe(mapOperator(map));
  }
}
