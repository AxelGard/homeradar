import {FeatureCollection, Point} from 'geojson';

export type HouseProps = {
  id: string;
  price: number;
  size: number;
};

export type EarthquakesGeojson = FeatureCollection<Point, HouseProps>;

export async function loadEarthquakeGeojson(): Promise<EarthquakesGeojson> {
  const url = new URL('../data/booli.json', import.meta.url);

  return await fetch(url).then(res => res.json());
}
