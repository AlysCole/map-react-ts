import { useEffect, useRef, useState, useContext } from 'react';
import { Map, InfoWindow, AdvancedMarker, useMapsLibrary, useMap, MapMouseEvent } from '@vis.gl/react-google-maps';
import {MarkerClusterer} from "@googlemaps/markerclusterer";
import type {Marker} from "@googlemaps/markerclusterer";

import PlacesContext, { Place } from '../../PlacesContext';
import MemoMarker from '../MemoMarker';

import { getUserLocation } from '../../utils/map';

interface InfoWindow {
    header?: string,
    content: React.ReactElement|string,
}

const MapView = () => {
    const [clickedLocation, setClickedLocation] = useState<MapMouseEvent|undefined|null>();
    const [infoWindow, setInfoWindow] = useState<InfoWindow>();
    const { places, addPlace } = useContext(PlacesContext);
    const [markers, setMarkers] = useState<{[key: string]: Marker}>({});

    const map = useMap();
    const geocodeLib = useMapsLibrary("geocoding");
    const geocoder = useRef<google.maps.Geocoder>();

    const placesLib = useMapsLibrary("places");
    const placesRef = useRef<google.maps.places.PlacesService>();
    const clusterer = useRef<MarkerClusterer | null>(null);

    /** Adds/deletes marker from markers state
     * @param {Marker} marker - marker ref
     * @param {string} key - Unique marker key (in this case, a place ID)
     */
    const setMarkerRef = (marker: Marker | null, key: string) => {
        if (marker && markers[key]) return;
        if (!marker && !markers[key]) return;

        setMarkers(prev => {
          if (marker) {
            return {...prev, [key]: marker};
          } else {
            const newMarkers = {...prev};
            delete newMarkers[key];
            return newMarkers;
          }
        });
    };

    useEffect((): void => {
        if (!map) return;

        // When the map is loaded, request for the user's location
        if (navigator?.geolocation) {
            const setMapLocation = (pos: google.maps.LatLngLiteral) => {
                if (map) map.setCenter(pos);
            }

            getUserLocation(map, setMapLocation, () => {
                // If an error occurs, default to the city of Amsterdam
                setMapLocation({
                    lat: 52.36847450105606,
                    lng: 4.897435129632838
                })
            }); 
        }

        // Initialize clusterer
        if (!clusterer.current) {
            clusterer.current = new MarkerClusterer({ map });
        }
    }, [map]);

    // Clear and re-update clusterer markers when marker list changes
    useEffect(() => {
        clusterer.current?.clearMarkers();
        clusterer.current?.addMarkers(Object.values(markers));
    }, [markers]);

    // Handle for Geocoder library import
    useEffect((): void => {
        if (!geocodeLib || !map) return;
        geocoder.current = new geocodeLib.Geocoder();
    }, [geocodeLib, map]);

    // Handle for Geocoder library import
    useEffect((): void => {
        if (!placesLib || !map) return;
        placesRef.current = new placesLib.PlacesService(map);
    }, [placesLib, map]);

    // Handler for click events on the map
    useEffect((): void => {
        if (clickedLocation) {
            // Reverse geocode the clicked coordinates
            geocoder.current
                ?.geocode({ location: clickedLocation?.detail?.latLng })
                ?.then((res: google.maps.GeocoderResponse) => {
                    if (res?.results?.[0]) {
                        console.log("Clicked location:", clickedLocation);
                        console.log("Geocode response:", res?.results?.[0]);
                        const coordinates = clickedLocation?.detail?.latLng;
                        const address = res?.results?.[0]?.formatted_address;
                        const id = res?.results?.[0]?.place_id;

                        // If a Place ID does not exist for clicked coordinates, show
                        // a custom info window
                        if (!clickedLocation?.detail?.placeId) {
                            // Display an info window with details on the selected
                            // coordinates
                            setInfoWindow({
                                header: address,
                                content: `${coordinates?.lat}, ${coordinates?.lng}`,
                            });
                        }

                        // Check if place already exists, and if so, don't duplicate the place
                        if (places && places.findIndex((place) => place?.id === id) > -1) return;

                        // Call places API to fetch the place name, if a place ID exists in the
                        // mouse event (otherwise, there was no place name)
                        if (!!clickedLocation?.detail?.placeId) {
                            placesRef.current?.getDetails({
                                placeId: clickedLocation?.detail?.placeId,
                                fields: ["name"]
                            }, (place, status) => {
                                if (
                                    status === google.maps.places.PlacesServiceStatus.OK &&
                                    place &&
                                    place?.name
                                ) {
                                    console.log("Place details:", place);
                                    // Add the place with a name, if a name is returned
                                    if (addPlace) {
                                        addPlace({
                                            name: place?.name,
                                            id,
                                            address,
                                            coordinates
                                        });
                                        return;
                                    }
                                }
                            });
                        // If no name exists, add the place without
                        } else {
                            if (addPlace) addPlace({
                                id, 
                                address,
                                coordinates: coordinates,
                            }) 
                        }
                    }
                })
                ?.catch((error) => {
                    console.error("[Geocoder] An error occurred while trying to reverse geocode a selected location:", error);
                })
        }
    }, [clickedLocation]);

    return (
        <Map
            mapId="e9553ff684d37422"
            defaultZoom={10}
            defaultCenter={{
                lat: 0.00,
                lng: 0.00,
            }}
            onClick={(event: MapMouseEvent) => {
                console.log("Clicked location:", event);
                // Otherwise, show a custom info window with the formatted address and
                // coordinates
                setClickedLocation(event);
            }}>
            {places?.map((place: Place) => (
                <MemoMarker placeId={place.id} lat={place?.coordinates?.lat || 0} lng={place?.coordinates?.lng || 0} refFunc={(marker: Marker) => setMarkerRef(marker, place.id)} />
            ))}
            {!!infoWindow && (
                <InfoWindow position={clickedLocation?.detail?.latLng} headerContent={infoWindow?.header} onCloseClick={() => {
                    setInfoWindow(undefined);
                }}>
                    {infoWindow?.content}
                </InfoWindow>
            )}
        </Map>
    );
};

export default MapView;
