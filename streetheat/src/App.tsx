import React, {useEffect, useState} from 'react';
import {createRoot} from 'react-dom/client';

import {APIProvider, Map} from '@vis.gl/react-google-maps';

import ControlPanel from './control-panel';
import Heatmap from './heatmap';
import {EarthquakesGeojson, loadEarthquakeGeojson} from './earthquakes';

const API_KEY =
  globalThis.GOOGLE_MAPS_API_KEY ?? (process.env.GOOGLE_MAPS_API_KEY as string);

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
      <h1>Street Heat</h1>
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
      <App />
    </React.StrictMode>
  );
}
