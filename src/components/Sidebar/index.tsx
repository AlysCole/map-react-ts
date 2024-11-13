import { useContext } from "react";
import PlacesContext, { Place } from "../../PlacesContext";

const SideBar = () => {
    const { places, removePlace } = useContext(PlacesContext);

    return (
        <aside id="default-sidebar" className="fixed top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0 drop-shadow-xl" aria-label="Sidebar">
           <div className="h-full px-1 py-2 overflow-y-auto bg-gray-50 dark:bg-gray-800">
              <ul className="space-y-2 overflow-y-auto">
                {places?.map((place: Place) => (
                    <li key={place?.id} className="flex flex-row justify-between items-center p-2 border-b-2 border-b-slate-300 text-slate-900">
                        <div className="flex flex-col items-start dark:text-white group">
                            <h2 className="font-bold text-slate-600">{place?.name}</h2>
                            <span>{place?.address}</span>
                            {!!place?.coordinates && <span className="text-xs text-slate-400">{place?.coordinates?.lat}, {place?.coordinates?.lng}</span>}
                        </div>
                        <span className="material-symbols-outlined p-1 text-white rounded-full bg-red-400 drop-shadow-md transition ease-in-out delay-75 hover:-translate-y-0.5 hover:scale-110 active:scale-105 active:translate-y-0 active:drop-shadow cursor-pointer" onClick={(event) => {
                            if (removePlace) removePlace(place)
                        }}>
                            delete
                        </span>
                    </li>
                ))}
             </ul>
           </div>
        </aside>
    )
};

export default SideBar;
