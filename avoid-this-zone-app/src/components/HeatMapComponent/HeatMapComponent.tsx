import React, {
    useCallback,
    useContext,
    useEffect,
    useState,
  } from 'react';
  import { useMap } from '@terrestris/react-util';
  
  import { fromLonLat } from 'ol/proj';
  import { Heatmap as HeatmapLayer } from 'ol/layer';
  import VectorSource from 'ol/source/Vector';
  import { Feature } from 'ol';
  import { Point } from 'ol/geom';
  
  import { RaidReportFirestoreData } from '../../firebase/firestore';
  
  import { MapComponentProps } from '@terrestris/react-geo/dist/Map/MapComponent/MapComponent';
import { AppDataContext, ReportQueryFilter } from '../../providers/AppDataContextProvider';
  // ^ Adjust path if you keep a separate data provider
  
  // Example: HeatMapComponent that consumes Firestore data and an OL map
  export const HeatMapComponent: React.FC<Partial<MapComponentProps>> = (props) => {
    const map = useMap();
  
    // If you have global data in a context, you can pull it in:
    const {
      reports,
      loadingReports,
      reportsError,
      setReportQueryFilters
    } = useContext(AppDataContext);
  
    // Store references to the heatmap layer and any features we add
    const [heatmapLayer] = useState(() => {
      const source = new VectorSource();
      const layer = new HeatmapLayer({
        source: source,
        blur: 1,
        radius: 4,
        weight: (feature) => feature.get('weight') || 1,
        gradient: ['#00f', '#0ff', '#0f0', '#ff0', '#f00'], // Customize as needed
        properties: { name: 'Heatmap Layer' },
      });
      return layer;
    });
  
    // Keep track of "local" features if needed
    const [features, setFeatures] = useState<Feature<Point>[]>([]);
  
    /**
     * Add a single Firestore record's coordinates as features on the heatmap.
     * Each record can contain multiple coordinate points => multiple features.
     */
    const addFeature = useCallback((data: RaidReportFirestoreData) => {
      data.coordinates.forEach((coordinate) => {
          const { longitude, latitude } = coordinate.geopoint;
          if (longitude === undefined || latitude === undefined) return;
      
          const feature = new Feature({
            geometry: new Point(fromLonLat([latitude, longitude])),
            weight: .5,
          });
      
          setFeatures((prev) => [...prev, feature]);
          heatmapLayer.getSource()?.addFeature(feature);
      })
  
    }, [heatmapLayer]);
    
    useEffect(() => {
      if (!map) return;
      map.addLayer(heatmapLayer);
      
      // Clear old features if needed
      heatmapLayer.getSource()?.clear();
      setFeatures([]);
  
      // Add features for each report
      reports.forEach((report: RaidReportFirestoreData) => {
        addFeature(report);
      });
  
      return () => {
        // Cleanup
        map.removeLayer(heatmapLayer);
      };
    }, [map, heatmapLayer, reports, addFeature]);
  
    // Simple check: if loading or error states
    if (loadingReports) {
      return <div>Loading heatmap...</div>;
    }
    if (reportsError) {
      return <div>Error loading heatmap data: {reportsError}</div>;
    }
  
    return (
      <React.Fragment>
        {/* If you have any UI or debug info, render it here.
            Otherwise, this component just sets up the layer. */}
        <div style={{ display: 'none' }}>
          HeatMap is active. 
          {/* Hidden or used for debugging? */}
        </div>
      </React.Fragment>
    );
  };
  