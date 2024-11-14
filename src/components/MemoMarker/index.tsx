import { memo } from "react"
import { AdvancedMarker } from "@vis.gl/react-google-maps"

interface MemoMarkerProps {
    placeId: string,
    lat: number,
    lng: number,
    refFunc: Function
}

/** Memoized Marker component to prevent re-rendering
 * @param {String} placeId - Place ID
 * @param {Number} lat - Latitude coordinate
 * @param {Number} lng - Longitude coordinate
 * @param {Function} refFunc - Function to set marker ref
 */
const MemoMarker = memo(({ placeId, lat, lng, refFunc }: MemoMarkerProps) => (
    <AdvancedMarker key={placeId} position={{ lat, lng }} animation={2} ref={refFunc}>
        <span className="material-symbols-outlined location text-4xl text-red-500 drop-shadow">
            location_on
        </span>
    </AdvancedMarker>
), (prevProps, nextProps) => {
    return (prevProps?.placeId === nextProps?.placeId) &&
            (prevProps?.lat === nextProps?.lat) &&
            (prevProps?.lng === nextProps?.lng);
});

export default MemoMarker;
