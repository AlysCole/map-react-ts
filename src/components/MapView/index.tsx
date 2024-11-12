import { useEffect, useRef, useState } from 'react';
import { Map, InfoWindow, useMapsLibrary, useMap, MapMouseEvent } from '@vis.gl/react-google-maps';

interface MapProps {
    places?: Array<{ name: string }>,
}

interface GeocodeResponse {
    results: Array<{formatted_address: string}>
}

interface InfoWindow {
    header: string,
    content: React.ReactElement|string,
}

const MapView = ({ places }: MapProps) => {
    const [currLocation, setCurrLocation] = useState<google.maps.LatLngLiteral|undefined>({
        lat: 0.00,
        lng: 0.00,
    });
    const [clickedLocation, setClickedLocation] = useState<google.maps.LatLngLiteral|undefined|null>();
    const [infoWindow, setInfoWindow] = useState<InfoWindow>();

    const map = useMap();
    const geocodeLib = useMapsLibrary("geocoding");
    const geocoder = useRef<google.maps.Geocoder>();

    /**
     * Request for user's current position
     */
    const getUserLocation = (): void => {
        navigator.geolocation.getCurrentPosition((position) => {
            setCurrLocation({
                lat: position.coords.latitude,
                lng: position.coords.longitude
            });
        }, (error) => {
            // Handle error here
            console.error("[getCurrentPosition] An error occurred while trying to request for the user's current position:", error);
        });
    }

    // On mount, request for the user's location
    useEffect((): void => {
        if (navigator?.geolocation) {
            getUserLocation(); 
        }
    }, []);

    // Handle for Geocoder library import
    useEffect((): void => {
        if (!geocodeLib || !map) return;
        geocoder.current = new geocodeLib.Geocoder();
    }, [geocodeLib, map]);

    // Handler for click events on the map
    useEffect((): void => {
        if (clickedLocation) {
            // Reverse geocode the clicked coordinates
            geocoder.current
                ?.geocode({ location: clickedLocation })
                ?.then((res: GeocodeResponse) => {
                    if (res?.results?.[0]) {
                        // Display an info window with details on the selected coordinates
                        setInfoWindow({
                            header: res?.results?.[0]?.formatted_address,
                            content: `${clickedLocation?.lat}, ${clickedLocation?.lng}`
                        });
                    }
                })
                ?.catch((error) => {
                    console.error("[Geocoder] An error occurred while trying to reverse geocode a selected location:", error);
                })
        }
    }, [clickedLocation]);

    return (
        <Map defaultZoom={5} defaultCenter={currLocation} onClick={(event: MapMouseEvent) => {
            // If a Place ID exists for the clicked location, keep default behavior
            if (event?.detail?.placeId) return;

            // Otherwise, show a custom info window with the formatted address and coordinates
            setClickedLocation(event?.detail?.latLng);
        }}>
            {!!clickedLocation && !!infoWindow && (
                <InfoWindow position={clickedLocation} headerContent={infoWindow?.header}>
                    {infoWindow?.content}
                </InfoWindow>
            )}
        </Map>
    );
};

export default MapView;
