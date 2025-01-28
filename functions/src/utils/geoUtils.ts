import * as turf from "@turf/turf"; // Import Turf.js

// Utility to generate random pins within a circle using Turf.js
export const generateRandomPins = (
  center: [number, number],
  radius: number, // Radius in meters
  count: number
): { lat: number; lon: number }[] => {
  const radiusInKilometers = radius / 1000;

  // Create a circular polygon using Turf.js
  const circle = turf.circle(center, radiusInKilometers, {steps: 64, units: "kilometers"});

  const bbox = turf.bbox(circle); // Bounding box of the circle

  const result: { lat: number; lon: number }[] = [];

  while (result.length < count) {
    // Generate a batch of random points
    const points = turf.randomPoint(count, {bbox});

    // Filter points to ensure they are within the circle
    const filteredPoints = points.features.filter((point) =>
      turf.booleanPointInPolygon(point, circle)
    );

    // Convert filtered points to lat/lon format and add to the result
    result.push(
      ...filteredPoints.map((feature) => ({
        lat: feature.geometry.coordinates[1],
        lon: feature.geometry.coordinates[0],
      }))
    );

    // Ensure we don't exceed the required count
    if (result.length > count) {
      result.length = count; // Trim excess points if needed
    }
  }

  return result;
};
