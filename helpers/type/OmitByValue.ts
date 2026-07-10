/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import type { KeysOfType } from './KeysOfType';

/**
 * Constructs a type by omitting all entries of `T` whose values extend `V`.
 *
 * Optional properties are matched by their non-nullable value type, so an
 * optional `string` property is omitted the same as a required one.
 *
 * @example
 * type Form = { name: string; age: number; email: string; active: boolean };
 * type NonStringFields = OmitByValue<Form, string>; // { age: number; active: boolean }
 * @since 3.0.0
 */
export type OmitByValue<T, V> = Omit<T, KeysOfType<T, V>>;
