import { useContext, useState } from "react";
import { FixedSizeList as List } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";

import PlacesContext, { Place } from "../../PlacesContext";

/** Sidebar for map app */
const SideBar = () => {
    const { places, removePlace, activePlace, setActivePlace } = useContext(PlacesContext);
    const [hideSidebar, setHideSidebar] = useState(false);

    const additionalSidebarClasses: String[] = [];

    if (hideSidebar) additionalSidebarClasses.push("-translate-x-full");

    const PlaceRow = ({ index, style }) => {
        const place = places?.[index];

        const placeClasses: String[] = [];

        if (activePlace === place?.id) placeClasses.push("opacity-50");

        return (
            <div
                style={style}
                className={`transition-opacity delay-100 flex flex-row h-20 justify-between items-center p-2 border-b-2 border-b-slate-300 text-slate-900 ${placeClasses?.join(" ")}`}
                onMouseEnter={() => {
                    if (setActivePlace) setActivePlace(place?.id)
                }}
                onMouseLeave={() => {
                    if (setActivePlace) setActivePlace();
                }}>
                <div className="flex flex-col items-start dark:text-white group w-full overflow-hidden">
                    <h2 className="w-full font-bold text-sky-600 text-nowrap text-ellipsis overflow-hidden">{place?.name}</h2>
                    <span className="text-nowrap text-ellipsis w-full overflow-hidden">{place?.address}</span>
                    {!!place?.coordinates && <span className="text-xs w-full overflow-hidden text-slate-400 text-nowrap text-ellipsis">{place?.coordinates?.lat}, {place?.coordinates?.lng}</span>}
                </div>
                <span className="material-symbols-outlined p-1 text-white rounded-full bg-red-400 drop-shadow-md transition ease-in-out delay-75 hover:-translate-y-0.5 hover:scale-110 active:scale-105 active:translate-y-0 active:drop-shadow cursor-pointer" onClick={(event) => {
                    if (removePlace) removePlace(place)
                }}>
                    delete
                </span>
            </div>
        );
    };

    return (
        <aside id="default-sidebar" className={`fixed top-0 z-40 w-64 h-screen transition-transform drop-shadow-xl ${additionalSidebarClasses?.join(" ")}`} aria-label="Sidebar">
            <div className="h-full px-1 py-2 overflow-y-auto bg-gray-50 dark:bg-gray-800">
                <AutoSizer>
                    {({ height })=> (
                        <List
                            className="space-y-2"
                            height={height}
                            itemCount={places?.length}
                            itemSize={80}
                            width={250}
                        >
                            {PlaceRow}
                        </List>
                    )}
                </AutoSizer>
            </div>
            <span className="material-symbols-outlined absolute z-10 top-0 left-full ml-2 mt-2 p-1 text-white rounded-full bg-sky-400 drop-shadow-md transition ease-in-out delay-75 hover:-translate-y-0.5 hover:scale-110 active:scale-105 active:translate-y-0 active:drop-shadow cursor-pointer" onClick={(event) => {
                // Toggle sidebar
                setHideSidebar((prev) => !prev);
            }}>
                menu
            </span>
        </aside>
    )
};

export default SideBar;
