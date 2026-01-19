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
import { withTrailingSlash } from './withTrailingSlash';

describe('withTrailingSlash', () => {
  test('should return undefined if input is undefined', () => {
    expect(withTrailingSlash(undefined)).toBe(undefined)
  });
  test('should return null if input is null', () => {
    expect(withTrailingSlash(null)).toBe(null)
  });
  test('should do nothing if trailing slash is already present', () => {
    expect(withTrailingSlash('foo/')).toBe('foo/')
  });
  test('should add trailing slash to an empty string', () => {
    expect(withTrailingSlash('')).toBe('/')
  });
  test('should add trailing slash to a string without trailing slash', () => {
    expect(withTrailingSlash('text-without-slash')).toBe('text-without-slash/')
  });
  test('should do nothing if input is a string of slashes', () => {
    expect(withTrailingSlash('/////////')).toBe('/////////')
  });
  test('should do nothing if input is a single slash', () => {
    expect(withTrailingSlash('/')).toBe('/')
  });
});
