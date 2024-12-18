import {useEffect, useMemo} from 'react';
import {useMap, useMapsLibrary} from '@vis.gl/react-google-maps';
import {FeatureCollection, Point, GeoJsonProperties} from 'geojson';

type HeatmapProps = {
  geojson: FeatureCollection<Point, GeoJsonProperties>;
  radius: number;
  opacity: number;
  isPriceChecked:boolean;
};
const Heatmap = ({geojson, radius, opacity, isPriceChecked}: HeatmapProps) => {
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
          w += point.properties?.price
        }
        return {
          location: new google.maps.LatLng(lng,lat),
          weight: w,
        };
      })
    );
  }, [heatmap, geojson, radius, opacity]);

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
