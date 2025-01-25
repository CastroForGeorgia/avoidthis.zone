// src/hooks/useDoubleClickDragZoom.ts
import { useEffect } from 'react';
import { Map } from 'ol';
import { DblClickDragZoom } from 'ol/interaction.js';

/**
 * A custom hook that adds the DblClickDragZoom interaction to the given map.
 * Cleans up on unmount or if the map changes.
 */
export function useDoubleClickDragZoom(map: Map | null) {
  useEffect(() => {
    if (!map) {
      return;
    }

    // Create the new DblClickDragZoom interaction.
    const dblClickDragZoom = new DblClickDragZoom({
      // optional config, e.g. condition, duration, out, etc.
      // See docs: https://openlayers.org/en/latest/apidoc/module-ol_interaction_DoubleClickZoom-DoubleClickZoom.html
    });

    // Extend the map’s existing interactions with this new one.
    // Alternatively, you could do a full replacement with `map.setInteractions()`,
    // but extending is simpler if you just want to add to existing defaults.
    map.getInteractions().extend([dblClickDragZoom]);

    // Cleanup: remove interaction if our component unmounts
    return () => {
      map.removeInteraction(dblClickDragZoom);
    };
  }, [map]);
}