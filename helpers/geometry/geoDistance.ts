/**
 * This file is part of helpers4.
 * Copyright (C) 2026 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

const EARTH_RADIUS_KM = 6371;

/**
 * Great-circle distance between two WGS84 points, in kilometres (haversine formula, mean Earth
 * radius of 6371 km). The Earth is treated as a sphere, so the result can be off by up to about
 * 0.5% compared to an ellipsoidal model — plenty for "how far is it" and radius checks. Near
 * antipodal points the formula loses a little precision (well under a metre).
 *
 * @param lat1 - Latitude of the first point, in degrees
 * @param lon1 - Longitude of the first point, in degrees
 * @param lat2 - Latitude of the second point, in degrees
 * @param lon2 - Longitude of the second point, in degrees
 * @returns The distance in kilometres
 * @example
 * geoDistance(48.8566, 2.3522, 51.5074, -0.1278) // => about 343.5 (Paris to London)
 * @since next
 */
export function geoDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const toRadians = Math.PI / 180;
  const dLat = (lat2 - lat1) * toRadians;
  const dLon = (lon2 - lon1) * toRadians;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * toRadians) * Math.cos(lat2 * toRadians) * Math.sin(dLon / 2) ** 2;
  return 2 * EARTH_RADIUS_KM * Math.asin(Math.min(1, Math.sqrt(a)));
}
