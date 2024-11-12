import { APIProvider } from '@vis.gl/react-google-maps';
import MapView from './components/MapView';

import './App.css'

interface Config {
    API_KEY: string;
}

const config: Config = {
    API_KEY: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
};

function App() {
    return (
        <div className="h-screen w-screen">
            <APIProvider apiKey={config.API_KEY}>
                <MapView />
            </APIProvider>
        </div>
    );
}

export default App
