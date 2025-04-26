import * as turf from '@turf/turf'; // Import Turf.js

// Utility to generate random pins within a circle using Turf.js
export const generateRandomPins = (
    center: [number, number],
    radius: number, // Radius in meters
    count: number
): { lat: number; lon: number }[] => {
    // Convert radius from meters to kilometers
    const radiusInKilometers = radius / 1000;

    // Create a circular polygon using Turf.js
    const circle = turf.circle(center, radiusInKilometers, { steps: 64, units: 'kilometers' });

    // Generate random points within the circle's bounding box
    const points = turf.randomPoint(count, { bbox: turf.bbox(circle) });

    // Filter points to ensure they are within the circle
    const filteredPoints = points.features.filter((point) =>
        turf.booleanPointInPolygon(point, circle)
    );

    // Convert filtered points to lat/lon format
    return filteredPoints.map((feature) => ({
        lat: feature.geometry.coordinates[1],
        lon: feature.geometry.coordinates[0],
    }));
};

/* ---------------------------------------------------------------------------
 * Additional geographic utilities
 * ------------------------------------------------------------------------ */

/**
 * Convert meters to kilometres.
 *
 * @param meters - Distance in metres.
 * @returns Equivalent distance in kilometres.
 */
export const metersToKilometres = (meters: number): number => meters / 1_000;

/**
 * Convert kilometres to metres.
 *
 * @param km - Distance in kilometres.
 * @returns Equivalent distance in metres.
 */
export const kilometresToMeters = (km: number): number => km * 1_000;

/**
 * Calculate the great‑circle distance (Haversine) between two coordinates.
 *
 * @param a - First coordinate as `[lon, lat]` in decimal degrees.
 * @param b - Second coordinate as `[lon, lat]` in decimal degrees.
 * @returns Distance in metres.
 *
 * @remarks
 * Uses Turf’s `distance()` with the “kilometres” unit then converts
 * the result to metres for consistency.
 */
export const haversineDistance = (
  a: [number, number],
  b: [number, number]
): number => turf.distance(a, b, { units: 'kilometers' }) * 1_000;

/**
 * Create an axis‑aligned bounding box around a central coordinate.
 *
 * @param center - `[lon, lat]` in decimal degrees.
 * @param radius - Buffer radius in metres.
 * @returns Bounding box as `[minLon, minLat, maxLon, maxLat]`.
 *
 * @example
 * ```ts
 * const bbox = getBoundingBox([-84.39, 33.75], 5_000);
 * ```
 */
export const getBoundingBox = (
  center: [number, number],
  radius: number
): [number, number, number, number] => {
  const circle = turf.circle(center, metersToKilometres(radius), {
    steps: 64,
    units: 'kilometers'
  });
  return turf.bbox(circle) as [number, number, number, number];
};

/**
 * Test whether a given point lies within a circle.
 *
 * @param point - `[lon, lat]` coordinate to test.
 * @param center - Circle centre `[lon, lat]`.
 * @param radius - Circle radius in metres.
 * @returns `true` if the point is inside (or on) the circle.
 */
export const isPointInCircle = (
  point: [number, number],
  center: [number, number],
  radius: number
): boolean => {
  const circle = turf.circle(center, metersToKilometres(radius), {
    steps: 64,
    units: 'kilometers'
  });
  return turf.booleanPointInPolygon(turf.point(point), circle);
};
