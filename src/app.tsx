import React, {useEffect, useState} from 'react';
import {createRoot} from 'react-dom/client';

import {APIProvider, Map} from '@vis.gl/react-google-maps';
import { BrowserRouter } from "react-router";
import ControlPanel from './control-panel';
import Heatmap from './heatmap';
import {EarthquakesGeojson, loadEarthquakeGeojson} from './earthquakes';
import {NavigationBar} from './navbar'

//const API_KEY = "AIzaSyBg3ZPbbgy-ef8rzhV7VX8XvOln2wlkLyQ";
const API_KEY = "AIzaSyAgv1kXjInpRxF3jVPQGCSi5pLwqRQnc7c"

const App = () => {
  const [radius, setRadius] = useState(25);
  const [opacity, setOpacity] = useState(0.8);

  const [earthquakesGeojson, setEarthquakesGeojson] =
    useState<EarthquakesGeojson>();

  useEffect(() => {
    loadEarthquakeGeojson().then(data => setEarthquakesGeojson(data));
  }, []);

  return (
    <APIProvider apiKey={API_KEY}>
      <NavigationBar></NavigationBar>
      <Map
        mapId={'7a9e2ebecd32a903'}
        defaultCenter={{lat: 59.327617892022914, lng:18.067634811237237}}
        defaultZoom={5}
        gestureHandling={'greedy'}
        disableDefaultUI={true}
      />

      {earthquakesGeojson && (
        <Heatmap
          geojson={earthquakesGeojson}
          radius={radius}
          opacity={opacity}
        />
      )}

      <ControlPanel
        radius={radius}
        opacity={opacity}
        onRadiusChanged={setRadius}
        onOpacityChanged={setOpacity}
      />
    </APIProvider>
  );
};
export default App;

export function renderToDom(container: HTMLElement) {
  const root = createRoot(container);

  root.render(
    <React.StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </React.StrictMode>
  );
}
