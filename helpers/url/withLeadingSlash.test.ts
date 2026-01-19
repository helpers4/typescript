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
import { withLeadingSlash } from './withLeadingSlash';

describe('withLeadingSlash', () => {
  test('should return undefined if input is undefined', () => {
    expect(withLeadingSlash(undefined)).toBe(undefined)
  });
  test('should return null if input is null', () => {
    expect(withLeadingSlash(null)).toBe(null)
  });
  test('should do nothing if leading slash is already present', () => {
    expect(withLeadingSlash('/foo')).toBe('/foo')
  });
  test('should add leading slash to an empty string', () => {
    expect(withLeadingSlash('')).toBe('/')
  });
  test('should add leading slash to a string without leading slash', () => {
    expect(withLeadingSlash('text-without-slash')).toBe('/text-without-slash')
  });
  test('should do nothing if input is a string of slashes', () => {
    expect(withLeadingSlash('/////////')).toBe('/////////')
  });
  test('should do nothing if input is a single slash', () => {
    expect(withLeadingSlash('/')).toBe('/')
  });
});
