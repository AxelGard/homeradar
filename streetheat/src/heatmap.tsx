import {useEffect, useMemo} from 'react';
import {useMap, useMapsLibrary} from '@vis.gl/react-google-maps';
import {FeatureCollection, Point, GeoJsonProperties} from 'geojson';
import {sigmoid} from './activation';

type HeatmapProps = {
  geojson: FeatureCollection<Point, GeoJsonProperties>;
  radius: number;
  opacity: number;
  isPriceChecked:boolean;
  targetPrice:number;
};
const Heatmap = ({geojson, radius, opacity, isPriceChecked, targetPrice}: HeatmapProps) => {
  const map = useMap();
  const visualization = useMapsLibrary('visualization');

  const heatmap = useMemo(() => {
    if (!visualization) return null;

    return new google.maps.visualization.HeatmapLayer({
      radius: radius,
      opacity: opacity
    });
  }, [visualization, radius, opacity]);

  useEffect(() => {
    if (!heatmap) return;

    heatmap.setData(
      geojson.features.map(point => {
        const [lng, lat] = point.geometry.coordinates;
        let w:number = 0;
        if (isPriceChecked){
          w = 1 / (1 + (Math.abs(point.properties?.price - targetPrice)/(targetPrice* 0.1))^0.5)
        } 
        return {
          location: new google.maps.LatLng(lng,lat),
          weight: w,
        };
      })
    );
  }, [heatmap, geojson, radius, opacity, isPriceChecked, targetPrice]);

  useEffect(() => {
    if (!heatmap) return;

    heatmap.setMap(map);

    return () => {
      heatmap.setMap(null);
    };
  }, [heatmap, map]);

  return null;
};

export default Heatmap;
