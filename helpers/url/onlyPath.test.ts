/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

/*
 * This program is under the terms of the GNU Affero General Public License version 3
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { expect, test, describe } from "vitest";
import { onlyPath } from './onlyPath';

describe('onlyPath', () => {
  test('should return the path without query and fragment', () => {
    expect(onlyPath('/path')).toBe('/path')
  });
  test('should return the path without query and fragment when query is present', () => {
    expect(onlyPath('/path?query=thing')).toBe('/path')
  });
  test('should return the path without query and fragment when fragment is present', () => {
    expect(onlyPath('/path#fragment')).toBe('/path')
  });
  test('should return the path without query and fragment when both query and fragment are present', () => {
    expect(onlyPath('/path?query=thing#fragment')).toBe('/path')
  });
  test('should return undefined if input is undefined', () => {
    expect(onlyPath(undefined)).toBe(undefined)
  });
  test('should return null if input is null', () => {
    expect(onlyPath(null)).toBe(null)
  });
});
