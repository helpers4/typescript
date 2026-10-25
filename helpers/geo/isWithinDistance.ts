/**
 * This file is part of helpers4.
 * Copyright (C) 2026 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { distance } from './distance';

/**
 * Whether a point lies within a radius of a center, the border included.
 *
 * @param centerLat - Latitude of the center, in degrees
 * @param centerLon - Longitude of the center, in degrees
 * @param radius - The radius in kilometres
 * @param pointLat - Latitude of the point, in degrees
 * @param pointLon - Longitude of the point, in degrees
 * @returns `true` when the point is at most `radius` kilometres from the center
 * @throws {RangeError} If `radius` is negative or `NaN`
 * @example
 * isWithinDistance(48.8566, 2.3522, 5, 48.8606, 2.3376) // => true (a few km from the center of Paris)
 * isWithinDistance(48.8566, 2.3522, 5, 51.5074, -0.1278) // => false (London)
 * @since next
 */
export function isWithinDistance(centerLat: number, centerLon: number, radius: number, pointLat: number, pointLon: number): boolean {
  if (Number.isNaN(radius) || radius < 0) throw new RangeError('isWithinDistance: radius must be a non-negative number');
  return distance(centerLat, centerLon, pointLat, pointLon) <= radius;
}
