import { createContext } from 'react'

import { Marker } from '@googlemaps/markerclusterer';

export interface Place {
    id: string,
    name?: string,
    address?: string,
    coordinates?: google.maps.LatLngLiteral
}

export type PlacesType = Array<Place> | {};

export interface PlacesContextType {
    places?: Place[],
    addPlace?: Function,
    removePlace?: Function,
    activePlace?: string,
    setActivePlace?: Function,
    hoveredPlace?: Place,
    setHoveredPlace?: Function,
    markers?: {[key: string]: Marker},
    setMarkers?: Function,
}

const PlacesContext = createContext<PlacesContextType>({
    places: [],
});

export default PlacesContext;

