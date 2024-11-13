import { createContext } from 'react'

export interface Place {
    id: String,
    name?: String,
    address?: String,
    coordinates?: google.maps.LatLngLiteral
}

export type PlacesType = Array<Place> | {};

export interface PlacesContextType {
    places?: Place[],
    addPlace?: Function,
    removePlace?: Function,
    activePlace?: Place,
    setActivePlace?: Function,
    hoveredPlace?: Place,
    setHoveredPlace?: Function
}

const PlacesContext = createContext<PlacesContextType>({
    places: [],
});

export default PlacesContext;

