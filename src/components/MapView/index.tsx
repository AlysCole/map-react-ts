import { useEffect, useRef, useState, useContext } from 'react';
import { Map, InfoWindow, Marker, useMapsLibrary, useMap, MapMouseEvent } from '@vis.gl/react-google-maps';
import PlacesContext, { Place } from '../../PlacesContext';

import { getUserLocation } from '../../utils/map';

interface InfoWindow {
    header?: string,
    content: React.ReactElement|string,
}

const MapView = () => {
    const [currLocation, setCurrLocation] = useState<google.maps.LatLngLiteral|undefined>({
        lat: 0.00,
        lng: 0.00,
    });
    const [clickedLocation, setClickedLocation] = useState<MapMouseEvent|undefined|null>();
    const [infoWindow, setInfoWindow] = useState<InfoWindow>();
    const { places, addPlace } = useContext(PlacesContext);

    const map = useMap();
    const geocodeLib = useMapsLibrary("geocoding");
    const geocoder = useRef<google.maps.Geocoder>();

    const placesLib = useMapsLibrary("places");
    const placesRef = useRef<google.maps.places.PlacesService>();

    // On mount, request for the user's location
    useEffect((): void => {
        if (navigator?.geolocation) {
            getUserLocation(map, setCurrLocation, () => {
                // If an error occurs, default to the city of Amsterdam
                setCurrLocation({
                    lat: 52.36847450105606,
                    lng: 4.897435129632838
                })
            }); 
        }
    }, []);

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
        <Map defaultZoom={10} center={currLocation} onClick={(event: MapMouseEvent) => {
            console.log("Clicked location:", event);
            // Otherwise, show a custom info window with the formatted address and
            // coordinates
            setClickedLocation(event);
        }}>
            {places?.map((place: Place) => (
                <Marker position={place?.coordinates} />
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
