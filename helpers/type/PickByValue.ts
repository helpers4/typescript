/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import type { KeysOfType } from './KeysOfType';

/**
 * Constructs a type by picking all entries of `T` whose values extend `V`.
 *
 * Optional properties are matched by their non-nullable value type, so an
 * optional `string` property is picked the same as a required one.
 *
 * @example
 * type Form = { name: string; age: number; email: string; active: boolean };
 * type StringFields = PickByValue<Form, string>; // { name: string; email: string }
 * @since 3.0.0
 */
export type PickByValue<T, V> = Pick<T, KeysOfType<T, V>>;
