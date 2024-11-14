/**
 * Request for user's current position
 * @param {google.maps.Map} map - Google Maps API "map" object to use when manipulating the map view
 * @param {Function} callback - Function to call with current location coordinates
 * @param {Function} handleError - Function to call when an error occurs
 */
export const getUserLocation = (map: google.maps.Map|null, callback: Function, handleError: Function) => {
    navigator.geolocation.getCurrentPosition((position) => {
        const pos = {
            lat: position?.coords?.latitude,
            lng: position?.coords?.longitude
        };
        if (callback) callback(pos);

        if (map) {
            // Move map center to current position
            map.panTo(pos);
            map.setZoom(20);
        }
    }, (error) => {
        console.error("[getCurrentPosition] An error occurred while trying to request for the user's current position:", error);
        if (handleError) handleError(error);
    });
}
