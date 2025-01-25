// src/hooks/useMapEvent.ts
import { useEffect } from 'react';
import { Map as OlMap } from 'ol';
import { EventTypes } from 'ol/Observable';

type EventHandler = (evt: any) => void;

/**
 * Hook to attach/detach an event handler to an OpenLayers Map.
 */
export function useMapEvent(
    map: OlMap | null | undefined,
    eventType: EventTypes,
    handler: EventHandler
) {
    useEffect(() => {
        if (!map) {
            return;
        }

        map.on(eventType, handler);

        // Cleanup on unmount or if map changes
        return () => {
            map.un(eventType, handler);
        };
    }, [map, eventType, handler]);
}