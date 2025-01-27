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
