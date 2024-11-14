import { useState } from 'react';
import { APIProvider } from '@vis.gl/react-google-maps';
import type {Marker} from "@googlemaps/markerclusterer";

import MapView from './components/MapView';
import SideBar from './components/Sidebar';

import PlacesContext, { Place } from "./PlacesContext";

import './App.css'

interface Config {
    API_KEY: string;
}

const config: Config = {
    API_KEY: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
};

function App() {
    // Manage the state of places at the parent-level
    const [places, setPlaces] = useState<Place[]>();
    const [hoveredPlace, setHoveredPlace] = useState<Place|undefined>();
    const [activePlace, setActivePlace] = useState<Place|undefined>();
    const [markers, setMarkers] = useState<{[key: string]: Marker}>({});

    /** Adds a place to the state
     * @param {Place} place - Place object
     */
    const addPlace = (place: Place) => {
        // Add place to state
        setPlaces((prevState) => {
            return [
                ...(prevState || []),
                place,
            ];
        });
    }

    /** Removes a place from the state
     * @param {Place} place - Place object
     */
    const removePlace = (place: Place) => {
        // Add place to state
        setPlaces((prevState) => {
            const newState = [...prevState || []];

            const placeIdx: number = newState.findIndex((p) => p?.id === place?.id);
            if (placeIdx > -1) newState?.splice(placeIdx, 1);

            return newState;
        });

        // Remove marker from markers state by ID
        if (markers?.[place.id]) {
            setMarkers((prev) => {
                const newMarkers = {...prev};
                delete newMarkers[place.id];
                return newMarkers;
            }) ;
        }
    }

    return (
        <div className="h-screen w-screen">
            <APIProvider apiKey={config.API_KEY}>
                {
                /* Pass the state of currently selected places through a provider
                 * so that the places are easily accessible and manageable
                 */
                }
                <PlacesContext.Provider value={{
                    places,
                    addPlace,
                    removePlace,
                    activePlace,
                    hoveredPlace,
                    setActivePlace,
                    setHoveredPlace,
                    markers,
                    setMarkers
                }}>
                    <SideBar />
                    <MapView />
                </PlacesContext.Provider>
            </APIProvider>
        </div>
    );
}

export default App
