/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 *
 * Internal helper shared by stringifyLines.ts and stringifySequence.ts. Not exported from the
 * package barrel — tests live in _serializeRecords.test.ts.
 */

import { stringifyCanonical } from './_canonical';

/**
 * Serializes each value as one compact (or canonical) JSON text, for a format that holds one
 * value per record. Throws on a value with no JSON representation rather than writing a record
 * that would read back as something else.
 * @ignore
 */
export function serializeRecords(caller: string, values: readonly unknown[], formatting: 'canonical' | undefined): string[] {
  if (!Array.isArray(values)) {
    throw new TypeError(`${caller}: expected an array of values, got ${values === null ? 'null' : typeof values}`);
  }
  return values.map((value, index) => {
    const text = formatting === 'canonical' ? stringifyCanonical(value) : JSON.stringify(value);
    if (text === undefined) {
      throw new TypeError(`${caller}: the value at index ${index} (${typeof value}) has no JSON representation`);
    }
    return text;
  });
}
