import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import Map from 'react-map-gl/maplibre';
import type { MapLayerMouseEvent } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';

import ControlPanel from './control-panel';
import Heatmap from './heatmap';
import { HomesGeojson, loadHomes } from './homes';
import { NavigationBar } from './navbar';

const MAP_STYLE = 'https://tiles.openfreemap.org/styles/positron';

const App = () => {
  const [radius, setRadius] = useState(25);
  const [opacity, setOpacity] = useState(0.8);
  const [homes, setHomes] = useState<HomesGeojson>();
  const [labelLayerId, setLabelLayerId] = useState<string>();

  useEffect(() => {
    loadHomes().then(setHomes);
  }, []);

  const onMapLoad = (e: MapLayerMouseEvent) => {
    const map = e.target;
    const layers = map.getStyle().layers ?? [];
    const firstSymbol = layers.find((l: any) => l.type === 'symbol');
    if (firstSymbol) setLabelLayerId(firstSymbol.id);
  };

  return (
    <>
      <NavigationBar />
      <div style={{ position: 'relative', flex: 1, minHeight: 0 }}>
        <Map
          initialViewState={{
            longitude: 18.067634811237237,
            latitude: 59.327617892022914,
            zoom: 5,
          }}
          mapStyle={MAP_STYLE}
          style={{ width: '100%', height: '100%' }}
          onLoad={onMapLoad}
        >
          {homes && (
            <Heatmap
              geojson={homes}
              radius={radius}
              opacity={opacity}
              beforeId={labelLayerId}
            />
          )}
        </Map>
        <ControlPanel
          radius={radius}
          opacity={opacity}
          onRadiusChanged={setRadius}
          onOpacityChanged={setOpacity}
        />
      </div>
    </>
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
