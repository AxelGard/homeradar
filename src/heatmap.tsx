import {useEffect, useMemo} from 'react';
import {useMap, useMapsLibrary} from '@vis.gl/react-google-maps';
import {FeatureCollection, Point, GeoJsonProperties} from 'geojson';
import {sigmoid} from './activation';
import { useSearchParams} from 'react-router';


type HeatmapProps = {
  geojson: FeatureCollection<Point, GeoJsonProperties>;
  radius: number;
  opacity: number;
};


enum HomeTypes {
  Apartment = "Apartment",
  House = "House ",
  TerracedHouse = "TerracedHouse",
  ChainHouse = "ChainHouse",
  Farm = "Farm",
  LeisureHouse = "LeisureHouse",
  Plot = "Plot",
  SemiDetachedHouse = "SemiDetachedHouse",
}


const Heatmap = ({geojson, radius, opacity}: HeatmapProps) => {
  const map = useMap();
  const visualization = useMapsLibrary('visualization');

  const heatmap = useMemo(() => {
    if (!visualization) return null;

    return new google.maps.visualization.HeatmapLayer({
      radius: radius,
      opacity: opacity
    });
  }, [visualization, radius, opacity]);

  const [searchParams, setSearchParams] = useSearchParams();
  const isTargetPriceChecked = searchParams.get('IsTargetPriceChecked') === "true";
  const targetPrice = searchParams.get('TargetPrice')?? "1000000";
  const isHomeSizeChecked = searchParams.get('IsHomeSizeChecked') === "false";
  const homeSize = searchParams.get('HomeSize')?? "0";
  const homeTypes = (searchParams.get('HomeTypes')?? Object.values(HomeTypes).toString()).split(",");

  useEffect(() => {
    if (!heatmap) return;

    heatmap.setData(
      geojson.features.map(point => {
        const [lng, lat] = point.geometry.coordinates;
        let w:number = 0.0001;
        // check that the point is of the selected home type
        console.log(homeTypes);
        if (homeTypes.includes(point.properties?.type)){
          if (Boolean(isHomeSizeChecked))
          {
            w += 1 / ( 1 +  Math.abs(+homeSize - point.properties?.size))
          }
          if (Boolean(isTargetPriceChecked)){
            w += 1 / (1 + (Math.abs(point.properties?.price - +targetPrice)/(+targetPrice* 0.1))^0.5);
          } 
        }
        return {
          location: new google.maps.LatLng(lng,lat),
          weight: w,
        };
      })
    );
  }, [heatmap, geojson, radius, opacity, isTargetPriceChecked, targetPrice, homeSize, isHomeSizeChecked]);

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
